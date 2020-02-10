/* eslint global-require: 0 */
// TO-DO: deprecated. Replaced by components/map

import React from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';

import compact from 'lodash/compact';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

import { BOUNDARIES } from 'components/ui/map/constants';

// Components
import LayerPopup from 'components/ui/map/popup/LayerPopup';
import Spinner from 'components/ui/Spinner';

// Redux
import { connect } from 'react-redux';

if (typeof window !== 'undefined') {
  /*
   * Workaround for 1px lines appearing in some browsers due to fractional transforms
   * and resulting anti-aliasing.
   * https://github.com/Leaflet/Leaflet/issues/3575
   */
  (function () {
    const originalInitTile = L.GridLayer.prototype._initTile;
    L.GridLayer.include({
      _initTile(tile) {
        originalInitTile.call(this, tile);
        const tileSize = this.getTileSize();
        tile.style.width = `${tileSize.x + 1}px`;
        tile.style.height = `${tileSize.y + 1}px`;
      }
    });
  }());
}

const MAP_CONFIG = {
  zoom: 2,
  minZoom: 2,
  latLng: {
    lat: 30,
    lng: -120
  },
  zoomControl: true
};

const VOID = () => {};

class Map extends React.Component {
  static propTypes = {
    swipe: PropTypes.bool,
    canDraw: PropTypes.bool,
    interactionEnabled: PropTypes.bool,
    disableScrollZoom: PropTypes.bool,

    // STORE
    mapConfig: PropTypes.object,
    location: PropTypes.object,
    sidebar: PropTypes.object,
    basemap: PropTypes.object,
    labels: PropTypes.object,
    boundaries: PropTypes.bool,
    filters: PropTypes.object,
    drawShape: PropTypes.array,
    layerGroups: PropTypes.array, // List of LayerGroup items
    interaction: PropTypes.object,
    interactionSelected: PropTypes.string,
    interactionLatLng: PropTypes.object,
    availableInteractions: PropTypes.array,

    // ACTIONS
    onMapInstance: PropTypes.func,
    onMapDraw: PropTypes.func,
    LayerManager: PropTypes.func,
    onMapParams: PropTypes.func,
    setLayerInteraction: PropTypes.func,
    setLayerInteractionSelected: PropTypes.func,
    setLayerInteractionLatLng: PropTypes.func
  };

  static defaultProps = {
    mapConfig: {},
    location: {},
    sidebar: {},
    basemap: {},
    labels: {},
    filters: {},
    interaction: {},
    interactionLatLng: {},
    drawShape: [{}],

    boundaries: false,
    swipe: false,
    canDraw: false,

    interactionEnabled: true,
    disableScrollZoom: true,

    layerGroups: [],
    availableInteractions: [],

    interactionSelected: null,

    onMapInstance: VOID,
    onMapDraw: VOID,
    LayerManager: VOID,
    onMapParams: VOID,
    setLayerInteraction: VOID,
    setLayerInteractionSelected: VOID,
    setLayerInteractionLatLng: VOID
  };

  state = {
    loading: false,
    mapHasInvalidState: false
  }

  componentDidMount() {
    this.hasBeenMounted = true;

    const mapOptions = Object.assign({}, MAP_CONFIG, this.props.mapConfig || {});

    if (!this.mapNode) return;

    this.map = L.map(this.mapNode, mapOptions);

    // RETURN INSTANCE
    this.props.onMapInstance(this.map);

    // OPTIONS
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

    // TODO: Move the draw logic to WRI api components
    if (this.props.canDraw) {
      this.editableLayers = new L.FeatureGroup();

      const DRAW_SHAPE_STYLES = { fillOpacity: 0.2, weight: 3, opacity: 1, color: '#FAB72E' };

      this.drawConfig = {
        position: 'topright',
        draw: {
          polygon: {
            showArea: true,
            shapeOptions: DRAW_SHAPE_STYLES,
            icon: new L.DivIcon({
              iconSize: new L.Point(10, 10),
              className: 'leaflet-div-icon leaflet-editing-icon c-map__draw--icon'
            })
          },
          polyline: false,
          circle: false,
          rectangle: false,
          marker: false,
          circlemarker: false
        },
        edit: {
          polygon: {
            showArea: true,
            shapeOptions: DRAW_SHAPE_STYLES
          },
          featureGroup: this.editableLayers,
          edit: false,
          remove: true
        }
      };

      this.drawControl = new L.Control.Draw(this.drawConfig);
      this.map.addLayer(this.editableLayers.bringToFront());

      this.map.on(L.Draw.Event.CREATED, (event) => {
        const { layer } = event;

        /* eslint-disable no-unused-expressions */
        // XXX : This is a bug in leaflet, whenever we go into edit mode the styles gets reset
        layer.options.editing || (layer.options.editing = {});
        layer.editing.enable();

        this.editableLayers.addLayer(layer);

        this.props.onMapDraw(this.editableLayers);
      });
    }

    // CONTROLS
    this.setAttribution();
    this.setZoomControl();
    if (this.props.canDraw) {
      this.setDrawControll();
    }

    // BASEMAP && LABELS && BOUNDARIES
    this.setBasemap(this.props.basemap);
    this.setLabels(this.props.labels);
    this.setBoundaries(this.props.boundaries);

    // LISTENERS
    this.setMapEventListeners();

    // LAYERS
    this.setLayerManager();

    const layers = this.props.layerGroups
      .filter(l => l.visible)
      .map(l => l.layers.find(la => la.active));

    this.addLayers(layers, this.props.filters);

    // SET VIEW
    this.map.setView([mapOptions.latLng.lat, mapOptions.latLng.lng], mapOptions.zoom);

    // BBOX
    if (mapOptions && mapOptions.bbox) {
      this.fitBounds({ bbox: mapOptions.bbox });
    }

    if (mapOptions && mapOptions.bounds) {
      this.fitBounds({ geometry: mapOptions.bounds });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // LAYER GROUPS
    const oldlayerGroups = this.props.layerGroups;
    const nextLayerGroups = nextProps.layerGroups;

    const oldLayers = oldlayerGroups.map(l => l.layers.find(la => la.active));
    const nextLayers = nextLayerGroups.map(l => l.layers.find(la => la.active));
    const unionLayers = new Set([...oldLayers, ...nextLayers]);

    const oldLayersIds = oldLayers.map(l => l.id);
    const nextLayersIds = nextLayers.map(l => l.id);

    // Check if the interactions updated in admin,
    // if so, we need to update the interaction for that layer
    if (!isEqual(this.props.availableInteractions, nextProps.availableInteractions) &&
        nextLayers.length === 1) {
      this.removeLayers(oldLayers);

      const modifyInteractionConfig = Object.assign(
        {},
        nextLayers[0].interactionConfig,
        { output: nextProps.availableInteractions }
      );

      const addInteractionConfigToLayer = Object.assign(
        {},
        nextLayers[0],
        { interactionConfig: modifyInteractionConfig }
      );

      this.addLayers([addInteractionConfigToLayer]);
    }

    if (oldLayersIds.length !== nextLayersIds.length) {
      // Test whether old & new layers are the same
      unionLayers.forEach((layer) => {
        if (!oldLayersIds.find(id => id === layer.id)) {
          this.addLayers([layer]);
        } else if (!nextLayersIds.find(id => id === layer.id)) {
          this.removeLayers([layer]);
        }
      });

      // POPUP
      if (this.popup) {
        this.popup.remove();
      }
    } else {
      // Set layer opacity
      if (!isEqual(
        oldlayerGroups.map(d => d.opacity),
        nextLayerGroups.map(d => d.opacity)
      )) {
        const layers = nextLayerGroups.map(lg =>
          ({ ...lg.layers.find(l => l.active), opacity: lg.opacity, visible: lg.visible }));

        this.layerManager.setOpacity(layers);

        // POPUP
        if (this.popup) {
          this.popup.remove();
        }
      }

      // Set layer visibility
      if (!isEqual(
        oldlayerGroups.map(d => d.visible),
        nextLayerGroups.map(d => d.visible)
      )) {
        const layers = nextLayerGroups.map(lg =>
          ({ ...lg.layers.find(l => l.active), opacity: lg.opacity, visible: lg.visible }));

        this.layerManager.setVisibility(layers);

        // POPUP
        if (this.popup) {
          this.popup.remove();
        }
      }

      // Set layer order
      if (!isEqual(oldLayersIds, nextLayersIds)) {
        this.layerManager.setZIndex(nextLayers);
      }

      // Set layer active
      if (!isEqual(oldLayersIds, nextLayersIds)) {
        unionLayers.forEach((layer) => {
          if (!oldLayersIds.find(id => id === layer.id)) {
            this.addLayers([layer]);
          } else if (!nextLayersIds.find(id => id === layer.id)) {
            this.removeLayers([layer]);
          }
        });

        // POPUP
        if (this.popup) {
          this.popup.remove();
        }
      }
    }

    // BASEMAP
    if (this.props.basemap !== nextProps.basemap) {
      this.setBasemap(nextProps.basemap);
    }

    // LABELS
    if (this.props.labels !== nextProps.labels) {
      this.setLabels(nextProps.labels);
    }

    // LOCATION
    if (!isEqual(
      this.props.location,
      nextProps.location
    )) {
      if (!isEqual(this.props.location.bbox, nextProps.location.bbox)) {
        this.fitBounds({ bbox: nextProps.location.bbox });
      }

      if (!isEqual(this.props.location.geometry, nextProps.location.geometry)) {
        this.fitBounds({ geometry: nextProps.location.geometry });
      }

      if (this.props.location.lat !== nextProps.location.lng) {
        this.map.setView(
          [nextProps.location.lat, nextProps.location.lng],
          nextProps.location.zoom
        );
      }
    }

    // BOUNDARIES
    if (this.props.boundaries !== nextProps.boundaries) {
      this.setBoundaries(nextProps.boundaries);
    }


    // INTERACTION
    if (
      nextProps.interactionLatLng &&
      (
        // interactionSelected changed
        (// interaction changed
          this.props.interactionSelected !== nextProps.interactionSelected || !isEmpty(nextProps.interaction) &&
        !isEqual(this.props.interaction, nextProps.interaction))
      )
    ) {
      const popupContainer = document.createElement('div');

      render(
        <LayerPopup
          interaction={nextProps.interaction}
          interactionSelected={nextProps.interactionSelected}
          interactionLayers={compact(nextLayerGroups.map(g =>
            g.layers.find(l => l.active && !isEmpty(l.interactionConfig))))}
          onChangeInteractiveLayer={this.props.setLayerInteractionSelected}
        />,
        popupContainer
      );

      this.popup = this.popup || L.popup({
        maxWidth: 400,
        minWidth: 240
      });

      this.popup
        .setLatLng(nextProps.interactionLatLng)
        .setContent(popupContainer)
        .openOn(this.map);
    }

    if (this.props.sidebar.open !== nextProps.sidebar.open && !this.state.mapHasInvalidState) {
      // Ensures that if map has invalid state (wrong container width/height)
      // we re-draw the map to fill it
      this.setState({ mapHasInvalidState: true });
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
    if (this.props.onMapParams) this.removeMapEventListeners();
    if (this.map) this.map.remove();
  }

  // SETTERS
  setLayerManager() {
    const onLayerAdded = () => {
      // Don't execute callback if component has been unmounted
      if (!this.hasBeenMounted) return;
      this.setState({ loading: false });

      // Set the zIndex after each layer add
      const layers = this.props.layerGroups.map(l => l.layers.find(la => la.active));
      this.layerManager.setZIndex(layers);
      this.layerManager.setVisibility(layers);
      this.layerManager.setOpacity(layers);
    };

    this.layerManager = new this.props.LayerManager(this.map, {
      swipe: this.props.swipe,
      onLayerAddedSuccess: onLayerAdded,
      onLayerAddedError: onLayerAdded,
      onLayerClick: (layer) => {
        if (this.props.setLayerInteractionLatLng) {
          this.props.setLayerInteractionLatLng(layer.latlng);
        }
        if (this.props.setLayerInteraction) this.props.setLayerInteraction(layer);
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

  setDrawControll() {
    if (this.drawControl) {
      this.map.addControl(this.drawControl);
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
  setLabels(labels) {
    if (this.labelLayer) this.labelLayer.remove();

    if (labels.id !== 'none') {
      this.labelLayer = L.tileLayer(labels.value, labels.options || {})
        .addTo(this.map)
        .setZIndex(1002);
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
        .setZIndex(1001);
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
      // Checks if map has changed its size container, if so, reload the map to fill it
      if (this.state.mapHasInvalidState) {
        this.map.invalidateSize();
        this.setState({ mapHasInvalidState: false });
      }

      // Dispatch the action to set the params
      this.props.onMapParams(this.getMapParams());
    }

    if (this.props.onMapParams) {
      this.map.on('zoomend', mapChangeHandler.bind(this));
      this.map.on('dragend', mapChangeHandler.bind(this));
    }
  }

  interactionsChanged(layers, nextLayers) {
    let same = layers.length === nextLayers.length;

    if (same) {
      layers.forEach((layer, key) => {
        same = !same ||
          !isEqual(layer.interactionConfig, nextLayers[key].interactionConfig);
      });
    }

    return same;
  }


  fitBounds({ bbox, geometry }) {
    let bounds;
    if (bbox) {
      bounds = [
        [bbox[1], bbox[0]],
        [bbox[3], bbox[2]]
      ];
    }

    if (geometry) {
      bounds = geometry.getBounds();
    }

    this.map.fitBounds(bounds, { padding: [20, 20] });
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
      this.layerManager.addLayer(layer, { ...(filters || this.props.filters) });
    });
  }

  removeLayers(layers) {
    if (!layers) this.layerManager.removeLayers();

    layers.forEach((layer) => {
      this.layerManager.removeLayer(layer.id);
    });
  }

  // RENDER
  render() {
    return (
      <div className="c-map">
        {this.state.loading && <Spinner isLoading />}
        <div ref={(node) => { this.mapNode = node; }} className="map-leaflet" />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  basemap: state.explore.map.basemap,
  labels: state.explore.map.labels,
  boundaries: state.explore.map.boundaries,
  sidebar: state.explore.sidebar
});

export default connect(mapStateToProps, null)(Map);
