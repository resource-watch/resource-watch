import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import { Popup } from 'react-map-gl';
import {
  Legend,
  LegendListItem,
  LegendItemToolbar,
  LegendItemButtonLayers,
  LegendItemButtonOpacity,
  LegendItemButtonVisibility,
  LegendItemButtonInfo,
  LegendItemTypes,
  LegendItemTimeStep
} from 'vizzuality-components';

// components
import Modal from 'components/modal/modal-component';
import LayerInfoModal from 'components/modal/layer-info-modal';
import Spinner from 'components/ui/Spinner';
import Map from 'components/map';
import LayerManager from 'components/map/layer-manager';
import MapControls from 'components/map/controls';
import ZoomControls from 'components/map/controls/zoom';
import ShareControls from 'components/map/controls/share';
import BasemapControls from 'components/map/controls/basemap';
import SearchControls from 'components/map/controls/search';
import ResetViewControls from 'components/map/controls/reset-view';
import LayerPopup from 'components/map/popup';

// constants
import { LEGEND_TIMELINE_PROPERTIES, TIMELINE_THRESHOLD } from './constants';

// styles
import './styles.scss';

class ExploreMap extends PureComponent {
  static propTypes = {
    embed: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    viewport: PropTypes.shape({}).isRequired,
    bounds: PropTypes.object.isRequired,
    basemap: PropTypes.object.isRequired,
    labels: PropTypes.object.isRequired,
    boundaries: PropTypes.bool.isRequired,
    activeLayers: PropTypes.array.isRequired,
    layerGroups: PropTypes.array.isRequired,
    layerGroupsInteraction: PropTypes.object.isRequired,
    layerGroupsInteractionSelected: PropTypes.string,
    layerGroupsInteractionLatLng: PropTypes.object,
    setViewport: PropTypes.func.isRequired,
    setBounds: PropTypes.func.isRequired,
    setBasemap: PropTypes.func.isRequired,
    setLabels: PropTypes.func.isRequired,
    setBoundaries: PropTypes.func.isRequired,
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
    const { id, layerConfig: { decode_config: decodeConfig } } = layer;

    setMapLayerParametrization({
      id,
      nextConfig: {
        ...decodeConfig && {
          decodeParams: {
            startDate: dates[0],
            endDate: dates[1]
          }
        },
        ...!decodeConfig && {
          params: {
            startDate: dates[0],
            endDate: dates[1]
          }
        }
      }
    });
  }

  onLayerLoading = (id, bool) => {
    this.setState({
      loading: {
        ...this.state.loading,
        [id]: bool
      }
    });
  }

  onClickLayer = ({ features, lngLat }) => {
    const {
      activeInteractiveLayers,
      layerGroupsInteraction
    } = this.props;

    // if there are no interactive layers, we ignore the onclick layer callback
    if (!activeInteractiveLayers.length) return null;

    const {
      activeInteractiveLayers,
      layerGroupsInteraction
    } = this.props;

    // if there are no interactive layers, we ignore the onclick layer callback
    if (!activeInteractiveLayers.length) return null;

    const {
      setMapLayerGroupsInteractionLatLng,
      setMapLayerGroupsInteraction
    } = this.props;

    let newinteractions = {};

    // if the user clicks on a zone where there is no data in any current layer
    // we will reset the current interaction of those layers to display "no data available" message
    if (!features.length) {
      newinteractions = Object.keys(layerGroupsInteraction).reduce((accumulator, currentValue) => ({
        ...accumulator,
        [currentValue]: {}
      }), {});
    } else {
      newinteractions = features.reduce((accumulator, currentValue) => ({
        ...accumulator,
        [currentValue.layer.source]: { data: currentValue.properties }
      }), {});
    }

    const _lngLat = {
      longitude: lngLat[0],
      latitude: lngLat[1]
    };

    setMapLayerGroupsInteractionLatLng(_lngLat);
    setMapLayerGroupsInteraction(newinteractions);

    return true;
  }

  onChangeInteractiveLayer = (selected) => {
    const { setMapLayerGroupsInteractionSelected } = this.props;

    setMapLayerGroupsInteractionSelected(selected);
  }

  handleClosePopup = () => {
    const { resetMapLayerGroupsInteraction } = this.props;

    resetMapLayerGroupsInteraction();
  }
  handleViewport = debounce((viewport) => {
    const { setViewport } = this.props;

    setViewport(viewport);
  }, 250)

  handleZoom = (zoom) => {
    const { setViewport } = this.props;

    setViewport({
      zoom,
      // transitionDuration is always set to avoid mixing
      // durations of other actions (like flying)
      transitionDuration: 250
    });
  }

  handleBasemap = (basemap) => {
    const { setBasemap } = this.props;
    const { id } = basemap;

    setBasemap(id);
  }

  handleLabels = (labels) => {
    const { setLabels } = this.props;

    setLabels(labels);
  }

  handleBoundaries = (boundaries) => {
    const { setBoundaries } = this.props;

    setBoundaries(boundaries);
  }

  handleSearch = (locationParams) => {
    const { setBounds } = this.props;

    setBounds({
      ...locationParams,
      options: { zoom: 2 }
    });
  }

  handleViewport = debounce((viewport) => {
    const { setViewport } = this.props;

    setViewport(viewport);
  }, 250)

  handleZoom = (zoom) => {
    const { setViewport } = this.props;

    setViewport({
      zoom,
      // transitionDuration is always set to avoid mixing
      // durations of other actions (like flying)
      transitionDuration: 250
    });
  }

  handleBasemap = (basemap) => {
    const { setBasemap } = this.props;
    const { id } = basemap;

    setBasemap(id);
  }

  handleLabels = (labels) => {
    const { setLabels } = this.props;

    setLabels(labels.id);
  }

  handleBoundaries = (boundaries) => {
    const { setBoundaries } = this.props;

    setBoundaries(boundaries);
  }

  handleSearch = (locationParams) => {
    const { setBounds } = this.props;

    setBounds({
      ...locationParams,
      options: { zoom: 2 }
    });
  }

  handleViewport = debounce((viewport) => {
    const { setViewport } = this.props;

    setViewport(viewport);
  }, 250)

  handleZoom = (zoom) => {
    const { setViewport } = this.props;

    setViewport({
      zoom,
      // transitionDuration is always set to avoid mixing
      // durations of other actions (like flying)
      transitionDuration: 250
    });
  }

  handleBasemap = (basemap) => {
    const { setBasemap } = this.props;
    const { id } = basemap;

    setBasemap(id);
  }

  handleLabels = (labels) => {
    const { setLabels } = this.props;

    setLabels(labels);
  }

  handleBoundaries = (boundaries) => {
    const { setBoundaries } = this.props;

    setBoundaries(boundaries);
  }

  handleSearch = (locationParams) => {
    const { setBounds } = this.props;

    setBounds({
      ...locationParams,
      options: { zoom: 2 }
    });
  }

  handleResetView = () => {
    const { setViewport } = this.props;

    setViewport({
      bearing: 0,
      pitch: 0,
      // transitionDuration is always set to avoid mixing
      // durations of other actions (like flying)
      transitionDuration: 250
    });
  }

  render() {
    const {
      embed,
      viewport,
      basemap,
      bounds,
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
    const { pitch, bearing } = viewport;
    const resetViewBtnClass = classnames({
      '-with-transition': true,
      '-visible': pitch !== 0 || bearing !== 0
    });

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

        {Object.keys(loading)
          .map(k => loading[k])
          .some(l => !!l) && <Spinner isLoading />}

        <Map
          mapboxApiAccessToken="pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w"
          onClick={this.onClickLayer}
          interactiveLayerIds={activeInteractiveLayers}
          mapStyle="mapbox://styles/resourcewatch/cjzmw480d00z41cp2x81gm90h"
          viewport={viewport}
          bounds={bounds}
          basemap={basemap.value}
          labels={labels.value}
          boundaries={boundaries}
          onViewportChange={this.handleViewport}
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

        <MapControls>
          <ZoomControls
            viewport={viewport}
            onClick={this.handleZoom}
          />
          <ShareControls />
          <BasemapControls
            basemap={basemap}
            labels={labels}
            boundaries={boundaries}
            onChangeBasemap={this.handleBasemap}
            onChangeLabels={this.handleLabels}
            onChangeBoundaries={this.handleBoundaries}
          />
          <SearchControls onSelectLocation={this.handleSearch} />
          <ResetViewControls
            className={resetViewBtnClass}
            onResetView={this.handleResetView}
          />
        </MapControls>

        <div className="c-legend-map">
          <Legend
            maxHeight={embed ? 100 : 300}
            onChangeOrder={this.onChangeOrder}
          >
            {layerGroups.map((lg, i) => (
              <LegendListItem
                index={i}
                key={lg.dataset}
                layerGroup={lg}
                toolbar={
                  embed ? (
                    <LegendItemToolbar>
                      <LegendItemButtonLayers />
                      <LegendItemButtonOpacity />
                      <LegendItemButtonVisibility />
                      <LegendItemButtonInfo />
                    </LegendItemToolbar>
                  ) : (
                    <LegendItemToolbar />
                    )
                }
                onChangeInfo={this.onChangeInfo}
                onChangeOpacity={this.onChangeOpacity}
                onChangeVisibility={this.onChangeVisibility}
                onChangeLayer={this.onChangeLayer}
                onRemoveLayer={this.onRemoveLayer}
              >
                <LegendItemTypes />
                <LegendItemTimeStep
                  handleChange={this.onChangeLayerDate}
                  customClass="rw-legend-timeline"
                  defaultStyles={LEGEND_TIMELINE_PROPERTIES}
                  dots={false}
                  {...lg.layers.length > TIMELINE_THRESHOLD && { dotStyle: { opacity: 0 } }}
                />
              </LegendListItem>
            ))}
          </Legend>
        </div>


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

export default ExploreMap;
