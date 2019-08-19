import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import { Popup } from 'react-map-gl';

// Map Controls
import BasemapControl from 'components/ui/map/controls/BasemapControl';
import ShareControl from 'components/ui/map/controls/ShareControl';
import SearchControl from 'components/ui/map/controls/SearchControl';

// Map Popups
import LayerPopup from 'components/map/popup';

// Components
import Spinner from 'components/ui/Spinner';

// WRI components
import {
  // Map,
  MapPopup,
  MapControls,
  ZoomControl,
  Legend,
  LegendListItem,
  LegendItemToolbar,
  LegendItemButtonLayers,
  LegendItemButtonOpacity,
  LegendItemButtonVisibility,
  LegendItemButtonInfo,
  LegendItemTypes,
  LegendItemTimeStep,
  LegendItemTimeline
} from 'vizzuality-components';

// Modal
import Modal from 'components/modal/modal-component';
import LayerInfoModal from 'components/modal/layer-info-modal';
import Map from 'components/map';
import LayerManager from 'components/map/layer-manager';

// utils
import CANVAS_DECODERS from 'utils/layers/canvas-decoders';

// constants
import { LEGEND_TIMELINE_PROPERTIES, TIMELINE_THRESHOLD } from './constants';

// styles
import './styles.scss';

class ExploreMapComponent extends React.Component {
  static propTypes = {
    embed: PropTypes.bool,

    open: PropTypes.bool.isRequired,

    zoom: PropTypes.number.isRequired,
    latLng: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    basemap: PropTypes.object.isRequired,
    labels: PropTypes.object.isRequired,
    boundaries: PropTypes.bool.isRequired,
    activeLayers: PropTypes.array.isRequired,
    layerGroups: PropTypes.array.isRequired,
    layerGroupsInteraction: PropTypes.object.isRequired,
    layerGroupsInteractionSelected: PropTypes.string,
    layerGroupsInteractionLatLng: PropTypes.object,

    setMapZoom: PropTypes.func.isRequired,
    setMapLatLng: PropTypes.func.isRequired,
    setMapBasemap: PropTypes.func.isRequired,
    setMapLabels: PropTypes.func.isRequired,
    setMapBoundaries: PropTypes.func.isRequired,

    toggleMapLayerGroup: PropTypes.func.isRequired,
    setMapLayerGroupVisibility: PropTypes.func.isRequired,
    setMapLayerGroupOpacity: PropTypes.func.isRequired,
    setMapLayerGroupActive: PropTypes.func.isRequired,
    setMapLayerGroupsOrder: PropTypes.func.isRequired,
    setMapLayerParametrization: PropTypes.func.isRequired,
    removeLayerParametrization: PropTypes.func.isRequired,
    resetLayerParametrization: PropTypes.func.isRequired,

    setMapLayerGroupsInteraction: PropTypes.func.isRequired,
    setMapLayerGroupsInteractionLatLng: PropTypes.func.isRequired,
    setMapLayerGroupsInteractionSelected: PropTypes.func.isRequired,
    resetMapLayerGroupsInteraction: PropTypes.func.isRequired
  };

  static defaultProps = {
    embed: false,
    layerGroupsInteractionSelected: null,
    layerGroupsInteractionLatLng: null
  }

  state = {
    layer: null,
    loading: {}
  };

  componentWillReceiveProps(nextProps) {
    const { layerGroups: prevLayerGroups } = this.props;

    const { layerGroups: nextLayerGroups } = nextProps;

    if (!!this.popup && prevLayerGroups.length !== nextLayerGroups.length) {
      this.popup.remove();
    }
  }

  componentDidUpdate(prevProps) {
    const { open: prevOpen } = prevProps;
    const { open: nextOpen } = this.props;

    if (prevOpen !== nextOpen) {
      this.map.invalidateSize();
    }
  }

  onChangeInfo = (layer) => {
    this.setState({ layer });
  };

  onChangeOpacity = debounce((l, opacity) => {
    this.props.setMapLayerGroupOpacity({ dataset: { id: l.dataset }, opacity });
  }, 250);

  onChangeVisibility = (l, visibility) => {
    this.props.setMapLayerGroupVisibility({
      dataset: { id: l.dataset },
      visibility
    });
  };

  onChangeLayer = (l) => {
    const {
      resetLayerParametrization,
      setMapLayerGroupActive
    } = this.props;

    resetLayerParametrization();

    setMapLayerGroupActive({
      dataset: { id: l.dataset },
      active: l.id
    });
  };

  onChangeLayerTimeLine = (l) => {
    this.props.setMapLayerGroupActive({ dataset: { id: l.dataset }, active: l.id });
  }

  onRemoveLayer = (l) => {
    const {
      toggleMapLayerGroup,
      removeLayerParametrization
    } = this.props;

    toggleMapLayerGroup({
      dataset: { id: l.dataset },
      toggle: false
    });

    removeLayerParametrization(l.id);
  };

  onChangeOrder = (datasetIds) => {
    this.props.setMapLayerGroupsOrder({ datasetIds });
  };

  onChangeLayerDate = (dates, layer) => {
    const { setMapLayerParametrization } = this.props;
    const { id, layerConfig: { decode_config } } = layer;

    setMapLayerParametrization({
      id,
      nextConfig: {
        ...decode_config && {
          decodeParams: {
            startDate: dates[0],
            endDate: dates[1]
          }
        },
        ...!decode_config && {
          params: {
            startDate: dates[0],
            endDate: dates[1]
          }
        }
      }
    });
  }

  // Map params
  onMapParams = debounce(({ zoom, latLng }) => {
    this.props.setMapZoom(zoom);
    this.props.setMapLatLng(latLng);
  }, 250);

  onLayerLoading = (id, bool) => {
    this.setState({
      loading: {
        ...this.state.loading,
        [id]: bool
      }
    });
  };

  onClickLayer = ({ features, lngLat }) => {
    const {
      setMapLayerGroupsInteractionLatLng,
      setMapLayerGroupsInteraction
    } = this.props;
    const _features = features.reduce((accumulator, currentValue) => ({
      ...accumulator,
      [currentValue.layer.source]: { data: currentValue.properties }
    }), {});
    const _lngLat = {
      longitude: lngLat[0],
      latitude: lngLat[1]
    };

    setMapLayerGroupsInteractionLatLng(_lngLat);
    setMapLayerGroupsInteraction(_features);
  }

  onChangeInteractiveLayer = (selected) => {
    const { setMapLayerGroupsInteractionSelected } = this.props;

    setMapLayerGroupsInteractionSelected(selected);
  }

  handleClosePopup = () => {
    const { resetMapLayerGroupsInteraction } = this.props;

    resetMapLayerGroupsInteraction();
  }

  render() {
    const {
      embed,
      zoom,
      latLng,
      location,
      basemap,
      labels,
      boundaries,
      activeLayers,
      activeInteractiveLayers,
      layerGroups,
      layerGroupsInteraction,
      layerGroupsInteractionSelected,
      layerGroupsInteractionLatLng
    } = this.props;

    const { loading, layer } = this.state;

    return (
      <div className="l-explore-map -relative">
        {/* Brand logo */}
        {embed && (
          <div className="embedded-rw-logo">
            <img
              srcSet="/static/images/embed/embed-map-logo@2x.png 2x,
                      /static/images/embed/embed-map-logo.png 1x"
              alt="Resource Watch"
              src=" /static/images/embed/embed-map-logo.png 1x"
            />
          </div>
        )}
        {/* Spinner */}
        {Object.keys(loading)
          .map(k => loading[k])
          .some(l => !!l) && <Spinner isLoading />}

        {/* Map */}
        <Map
          mapboxApiAccessToken="pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w"
          mapStyle="mapbox://styles/resourcewatch/cjww836hy1kep1co5xp717jek"
          onClick={this.onClickLayer}
          interactiveLayerIds={activeInteractiveLayers}
        >
          {_map => (
            <Fragment>
              <LayerManager
                map={_map}
                layers={activeLayers}
              />

              {!isEmpty(layerGroupsInteractionLatLng) &&
                <Popup
                  {...layerGroupsInteractionLatLng}
                  closeButton
                  closeOnClick={false}
                  onClose={this.handleClosePopup}
                  className="rw-popup-layer"
                  maxWidth="250px"
                >
                  <LayerPopup
                    data={{
                      // data available in certain point
                      layersInteraction: layerGroupsInteraction,
                      // ID of the layer will display data (defualts into the first layer)
                      layersInteractionSelected: layerGroupsInteractionSelected,
                      // current active layers to get their layerConfig attributes
                      layers: activeLayers
                    }}
                    latlng={{
                      lat: layerGroupsInteractionLatLng.latitude,
                      lng: layerGroupsInteractionLatLng.longitude
                    }}
                    onChangeInteractiveLayer={this.onChangeInteractiveLayer}
                  />
                </Popup>
              }
            </Fragment>
          )}
        </Map>

        {!!layer && (
          <Modal
            isOpen={!!layer}
            className="-medium"
            onRequestClose={() => this.onChangeInfo(null)}
          >
            <LayerInfoModal layer={layer} />
          </Modal>
        )}
      </div>
    );
  }
}

export default ExploreMapComponent;
