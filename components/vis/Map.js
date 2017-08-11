import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

// Components
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

    // If leaflet haven't been imported, we can just skip the next steps
    if (!L) return;

    requestAnimationFrame(() => {
      this.map = L.map(this.mapNode, mapOptions);

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

      // SETTERS
      this.setAttribution();
      this.setZoomControl();
      this.setBasemap();
      this.setMapEventListeners();

      // Add layers
      this.setLayerManager();
      const layers = this.props.layerGroups
        .filter(l => l.visible)
        .map(l => l.layers.find(la => la.active));

      this.addLayers(layers, this.props.filters);
    });
  }

  componentWillReceiveProps(nextProps) {
    const filtersChanged = !isEqual(nextProps.filters, this.props.filters);

    const layerGroups = this.props.layerGroups.filter(l => l.visible);
    const nextLayerGroups = nextProps.layerGroups.filter(l => l.visible);

    const layerGroupsChanged = !isEqual(layerGroups, nextLayerGroups);

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
      onLayerAddedError: stopLoading
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

  setBasemap() {
    this.tileLayer = L.tileLayer(process.env.BASEMAP_TILE_URL, {})
                      .addTo(this.map)
                      .setZIndex(0);
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
  interactionEnabled: true
};

Map.propTypes = {
  interactionEnabled: PropTypes.bool.isRequired,
  // STORE
  mapConfig: PropTypes.object,
  filters: PropTypes.object,
  sidebar: PropTypes.object,
  LayerManager: PropTypes.func,
  layerGroups: PropTypes.array, // List of LayerGroup items
  // ACTIONS
  setMapParams: PropTypes.func
};

const mapStateToProps = state => ({
  sidebar: state.explore.sidebar
});

export default connect(mapStateToProps, null)(Map);
