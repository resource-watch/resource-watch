import React from 'react';
import isEqual from 'lodash/isEqual';
import Spinner from 'components/ui/Spinner';
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

    const mapOptions = {
      minZoom: MAP_CONFIG.minZoom,
      zoom: isNaN(this.props.mapConfig) ? MAP_CONFIG.zoom : this.props.mapConfig.zoom,
      zoomControl: this.props.mapConfig
        ? this.props.mapConfig.zoomControl
        : MAP_CONFIG.zoomControl,
      center: isNaN(this.props.mapConfig)
        ? [MAP_CONFIG.latLng.lat, MAP_CONFIG.latLng.lng]
        : [this.props.mapConfig.latLng.lat, this.props.mapConfig.latLng.lng],
      detectRetina: true,
      scrollWheelZoom: isNaN(this.props.mapConfig) ? false : !!this.props.mapConfig.scrollWheelZoom
    };

    // If leaflet haven't been imported, we can just skip the next steps
    if (!L) return;

    requestAnimationFrame(() => {
      this.map = L.map(this.mapNode, mapOptions);

      if (this.props.mapConfig && this.props.mapConfig.bounds) {
        this.fitBounds(this.props.mapConfig.bounds.geometry);
      }

      // SETTERS
      this.setAttribution();
      this.setZoomControl();
      this.setBasemap();
      this.setMapEventListeners();

      // Add layers
      this.setLayerManager();
      this.addLayers(this.props.layersActive, this.props.filters);
    });
  }

  componentWillReceiveProps(nextProps) {
    const filtersChanged = !isEqual(nextProps.filters, this.props.filters);
    const layersActiveChanged = !isEqual(nextProps.layersActive, this.props.layersActive);

    if (filtersChanged || layersActiveChanged) {
      const newLayers = nextProps.layersActive.map(l => l.id);
      const oldLayers = this.props.layersActive.map(l => l.id);

      const setNew = new Set(newLayers);
      const setOld = new Set(oldLayers);
      const union = new Set([...newLayers, ...oldLayers]);
      const difference = newLayers.filter(n => !setOld.has(n));
      let layer;
      // Test whether old & new layers are the same & only have to change the order
      if (newLayers.length === oldLayers.length && !difference.length) {
        this.layerManager.setZIndex(nextProps.layersActive);
      } else {
        union.forEach((parsedLayer) => {
          if (!setOld.has(parsedLayer)) {
            layer = nextProps.layersActive.filter(l => l.id === parsedLayer)[0];
            this.addLayers(layer);
          } else if (!setNew.has(parsedLayer)) {
            layer = this.props.layersActive.filter(l => l.id === parsedLayer)[0];
            this.removeLayers(layer);
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
    if (!layers) return;
    const arrayLayers = layers instanceof Array ? layers : [layers];

    arrayLayers.forEach((layer) => {
      this.setState({
        loading: true
      });
      this.layerManager.addLayer(layer, filters || this.props.filters);
    });
  }

  removeLayers(layer) {
    if (layer) this.layerManager.removeLayer(layer.id);
    else this.layerManager.removeLayers();
  }

  // RENDER
  render() {
    const spinnerStyles = (typeof window === 'undefined') ? {} : { marginLeft: this.setSpinnerPosition() };
    const mapClass = !this.state.sidebar.open ? '-fullWidth' : '';

    return (
      <div className={`c-map ${mapClass}`}>
        {this.state.loading && <Spinner isLoading style={spinnerStyles} />}
        <div ref={(node) => { this.mapNode = node; }} className="map-leaflet" />
      </div>
    );
  }
}

Map.propTypes = {
  // STORE
  mapConfig: React.PropTypes.object,
  filters: React.PropTypes.object,
  sidebar: React.PropTypes.object,
  LayerManager: React.PropTypes.func,
  layersActive: React.PropTypes.array,
  // ACTIONS
  setMapParams: React.PropTypes.func
};

const mapStateToProps = state => ({
  sidebar: state.explore.sidebar
});

export default connect(mapStateToProps, null)(Map);
