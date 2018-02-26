import React from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';

import compact from 'lodash/compact';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

import { LABELS, BOUNDARIES } from 'components/ui/map/constants';

// Components
import MapPopup from 'components/ui/map/MapPopup';
import Spinner from 'components/ui/Spinner';

// Redux
import { connect } from 'react-redux';

// Leaflet can't be imported on the server because it's not isomorphic
const L = (typeof window !== 'undefined') ? require('leaflet') : null;

const MAP_CONFIG = {
  zoom: 2,
  minZoom: 2,
  latLng: {
    lat: 30,
    lng: -120
  },
  zoomControl: true
};

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      sidebar: {
        open: props.sidebar.open,
        width: props.sidebar.width
      }
    };
  }

  componentDidMount() {
    this.hasBeenMounted = true;

    const mapOptions = Object.assign({}, MAP_CONFIG, this.props.mapConfig || {});
    mapOptions.center = [mapOptions.latLng.lat, mapOptions.latLng.lng];

    if (!this.mapNode) return;

    this.map = L.map(this.mapNode, mapOptions);

    if (this.props.setMapInstance) {
      this.props.setMapInstance(this.map);
    }

    if (this.props.mapConfig && this.props.mapConfig.bounds) {
      this.fitBounds(this.props.mapConfig.bounds.geometry);
    }

    // Disable interaction if necessary
    if (!this.props.interactionEnabled) {
      this.map.dragging.disable();
      this.map.touchZoom.disable();
      this.map.doubleClickZoom.disable();
      this.map.scrollWheelZoom.disable();
      this.map.boxZoom.disable();
      this.map.keyboard.disable();
    }

    if (this.props.disableScrollZoom) {
      this.map.scrollWheelZoom.disable();
    }

    // SETTERS
    this.setAttribution();
    this.setZoomControl();
    this.setBasemap(this.props.basemap);
    this.setMapEventListeners();

    this.setLabels(this.props.labels);
    this.setBoundaries(this.props.boundaries);

    // Add layers
    this.setLayerManager();
    const layers = this.props.layerGroups
      .filter(l => l.visible)
      .map(l => l.layers.find(la => la.active));
    this.addLayers(layers, this.props.filters);
  }

  componentWillReceiveProps(nextProps) {
    const filtersChanged = !isEqual(nextProps.filters, this.props.filters);

    const layerGroups = this.props.layerGroups.filter(l => l.visible);
    const nextLayerGroups = nextProps.layerGroups.filter(l => l.visible);

    const layerGroupsChanged = !isEqual(layerGroups, nextLayerGroups);

    const opacities = layerGroups.map(d => ({
      dataset: d.dataset, opacity: d.layers[0].opacity !== undefined ? d.layers[0].opacity : 1
    }));
    const nextOpacities = nextLayerGroups.map(d => ({
      dataset: d.dataset, opacity: d.layers[0].opacity !== undefined ? d.layers[0].opacity : 1
    }));

    if (!isEqual(opacities, nextOpacities)) {
      // Set opacity if changed
      const nextLayers = nextLayerGroups
        .map(l => l.layers.find(la => la.active));
      this.layerManager.setOpacity(nextLayers);
    }

    if (filtersChanged || layerGroupsChanged) {
      const layers = layerGroups
        .map(l => l.layers.find(la => la.active));
      const nextLayers = nextLayerGroups
        .map(l => l.layers.find(la => la.active));

      const layersIds = layers.map(l => l.id);
      const nextLayersIds = nextLayers.map(l => l.id);

      const union = new Set([...layers, ...nextLayers]);
      const difference = layersIds.filter(id => !nextLayersIds.find(id2 => id === id2));

      // Test whether old & new layers are the same & only have to change the order
      if (layers.length === nextLayers.length && !difference.length) {
        this.layerManager.setZIndex(nextLayers);
      } else {
        union.forEach((layer) => {
          if (!layersIds.find(id => id === layer.id)) {
            this.addLayers([layer]);
          } else if (!nextLayersIds.find(id => id === layer.id)) {
            this.removeLayer(layer);
          }
        });
      }
    }

    if (this.props.sidebar.width !== nextProps.sidebar.width) {
      this.setState({
        sidebar: nextProps.sidebar
      });
    }
    if (this.props.basemap !== nextProps.basemap) {
      this.setBasemap(nextProps.basemap);
    }
    if (this.props.labels !== nextProps.labels) {
      this.setLabels(nextProps.labels);
    }

    if (this.props.boundaries !== nextProps.boundaries) {
      this.setBoundaries(nextProps.boundaries);
    }

    // POPUP
    if (
      nextProps.interactionLatLng &&
      (
        // interactionSelected changed
        this.props.interactionSelected !== nextProps.interactionSelected) ||

        // interaction changed
        (
          !isEmpty(nextProps.interaction) &&
          !isEqual(this.props.interaction, nextProps.interaction)
        )
    ) {
      // Get the current interactive layer content
      const currentContent = render(
        MapPopup({
          interaction: nextProps.interaction,
          interactionSelected: nextProps.interactionSelected,
          interactionLayers: compact(nextLayerGroups.map(g =>
            g.layers.find(l => l.active && !isEmpty(l.interactionConfig))
          )),
          onChangeInteractiveLayer: this.props.setLayerInteractionSelected
        }),
        window.document.createElement('div')
      );

      this.popup = this.popup || L.popup();
      this.popup
        .setLatLng(nextProps.interactionLatLng)
        .setContent(currentContent)
        .openOn(this.map);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const loadingChanged = this.state.loading !== nextState.loading;
    const sidebarWidthChanged = this.props.sidebar.width !== nextProps.sidebar.width;
    return loadingChanged || sidebarWidthChanged;
  }

  componentWillUnmount() {
    this.hasBeenMounted = false;

    // Remember to remove the listeners before removing the map
    // or they will stay in memory
    if (this.props.setMapParams) this.removeMapEventListeners();
    if (this.map) this.map.remove();
  }


  // SETTERS
  setLayerManager() {
    const stopLoading = () => {
      // Don't execute callback if component has been unmounted
      if (!this.hasBeenMounted) return;
      this.setState({ loading: false });
    };

    this.layerManager = new this.props.LayerManager(this.map, {
      onLayerAddedSuccess: stopLoading,
      onLayerAddedError: stopLoading,
      onLayerClick: (layer) => {
        this.props.setLayerInteractionLatLng(layer.latlng);
        this.props.setLayerInteraction(layer);
      }
    });
  }

  setAttribution() {
    this.map.attributionControl.addAttribution('&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>');
  }

  setZoomControl() {
    if (this.map.zoomControl) {
      this.map.zoomControl.setPosition('topright');
    }
  }

  setBasemap(basemap) {
    if (this.tileLayer) this.tileLayer.remove();

    this.tileLayer = L.tileLayer(basemap.value, basemap.options)
      .addTo(this.map)
      .setZIndex(0);
  }

  /**
   * Set the labels layer
   * @param {string} labelsId
   */
  setLabels(labelsId) {
    if (this.labelLayer) this.labelLayer.remove();

    if (labelsId !== 'none') {
      const labels = LABELS[labelsId];

      this.labelLayer = L.tileLayer(labels.value, labels.options || {})
        .addTo(this.map)
        .setZIndex(this.props.layerGroups.length + 2);
    }
  }

  /**
   * Set the boundaries layer
   * @param {boolean} visible Whether the boundaries are visible or not
   */
  setBoundaries(visible) {
    if (!visible && this.boundariesLayer) {
      this.boundariesLayer.remove();
      this.boundariesLayer = undefined;
    } else if (visible && !this.boundariesLayer) {
      const boundaries = BOUNDARIES.dark;
      this.boundariesLayer = L.tileLayer(boundaries.value, boundaries.options || {})
        .addTo(this.map)
        .setZIndex(this.props.layerGroups.length + 1);
    }
  }

  // GETTERS
  getMapParams() {
    const params = {
      zoom: this.getZoom(),
      latLng: this.getCenter()
    };
    return params;
  }

  // MAP FUNCTIONS
  getCenter() { return this.map.getCenter(); }

  getZoom() { return this.map.getZoom(); }

  // MAP LISTENERS
  setMapEventListeners() {
    function mapChangeHandler() {
      // Dispatch the action to set the params
      this.props.setMapParams(this.getMapParams());
    }

    if (this.props.setMapParams) {
      this.map.on('zoomend', mapChangeHandler.bind(this));
      this.map.on('dragend', mapChangeHandler.bind(this));
    }
  }

  setSpinnerPosition() {
    const windowWidth = window.innerWidth;
    const sidebarWidth = this.state.sidebar.width;

    return ((windowWidth - sidebarWidth) / 2);
  }

  fitBounds(geoJson, sidebarWidth) {
    const geojsonLayer = L.geoJson(geoJson);
    this.map.fitBounds(geojsonLayer.getBounds(), {
      paddingTopLeft: [sidebarWidth || 0, 0],
      paddingBottomRight: [0, 0]
    });
  }

  removeMapEventListeners() {
    this.map.off('zoomend');
    this.map.off('dragend');
  }

  // LAYER METHODS
  addLayers(layers, filters) {
    if (!layers) return;
    if (layers.length) this.setState({ loading: true });
    layers.forEach((layer) => {
      this.layerManager.addLayer(layer, {
        ...(filters || this.props.filters),
        zIndex: layer.order
      });
    });
  }

  removeLayer(layer) {
    if (layer) this.layerManager.removeLayer(layer.id);
    else this.layerManager.removeLayers();
  }

  // RENDER
  render() {
    // FIXME: First, the loader can't me just moved like that because the map
    // can be used in a variety of context (different pages).
    // Second, even in the case of the Explore page this rule doesn't make sense:
    // if the sidebar is collapsed, the loader shouldn't be on the side
    // eslint-disable-next-line max-len
    // const spinnerStyles = (typeof window === 'undefined') ? {} : { marginLeft: this.setSpinnerPosition() };
    const spinnerStyles = {};
    const mapClass = !this.state.sidebar.open ? '-fullWidth' : '';

    return (
      <div className={`c-map ${mapClass}`}>
        {this.state.loading && <Spinner isLoading style={spinnerStyles} />}
        <div ref={(node) => { this.mapNode = node; }} className="map-leaflet" />
      </div>
    );
  }
}

Map.defaultProps = {
  interactionEnabled: true,
  disableScrollZoom: true,
  useLightBasemap: false
};

Map.propTypes = {
  interactionEnabled: PropTypes.bool.isRequired,
  disableScrollZoom: PropTypes.bool.isRequired,
  setMapInstance: PropTypes.func,
  // STORE
  mapConfig: PropTypes.object,
  sidebar: PropTypes.object,
  basemap: PropTypes.object,
  labels: PropTypes.string,
  boundaries: PropTypes.bool,
  filters: PropTypes.object,
  layerGroups: PropTypes.array, // List of LayerGroup items
  interaction: PropTypes.object,
  interactionSelected: PropTypes.string,
  interactionLatLng: PropTypes.object,
  LayerManager: PropTypes.func,

  // ACTIONS
  setMapParams: PropTypes.func,
  setLayerInteraction: PropTypes.func,
  setLayerInteractionSelected: PropTypes.func,
  setLayerInteractionLatLng: PropTypes.func,
  resetLayerInteraction: PropTypes.func
};

const mapStateToProps = state => ({
  basemap: state.explore.basemap,
  labels: state.explore.labels,
  boundaries: state.explore.boundaries,
  sidebar: state.explore.sidebar
});

export default connect(mapStateToProps, null)(Map);
