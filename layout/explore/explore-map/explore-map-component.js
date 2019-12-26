import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

// Map Controls
import BasemapControl from 'components/ui/map/controls/BasemapControl';
import ShareControl from 'components/ui/map/controls/ShareControl';
import SearchControl from 'components/ui/map/controls/SearchControl';

// Map Popups
import LayerPopup from 'components/ui/map/popup/LayerPopup';

// Components
import Spinner from 'components/ui/Spinner';

// WRI components
import {
  Map,
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

import { LayerManager, Layer } from 'layer-manager/dist/components';
import { PluginLeaflet } from 'layer-manager';

// Modal
import Modal from 'components/modal/modal-component';
import LayerInfoModal from 'components/modal/layer-info-modal';

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

  UNSAFE_componentWillReceiveProps(nextProps) {
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
          mapOptions={{
            zoom,
            center: latLng
          }}
          basemap={{
            url: basemap.value,
            options: basemap.options
          }}
          label={{
            url: labels.value,
            options: labels.options
          }}
          bounds={{
            bbox: location.bbox,
            options: {}
          }}
          events={{
            resize: debounce((e, map) => {
              map.invalidateSize();
            }, 250),
            zoomend: (e, map) => {
              this.onMapParams({
                zoom: map.getZoom(),
                latLng: map.getCenter()
              });
            },
            dragend: (e, map) => {
              this.onMapParams({
                zoom: map.getZoom(),
                latLng: map.getCenter()
              });
            }
          }}
          scrollZoomEnabled={!embed}
          onReady={(map) => {
            this.map = map;
            console.info(this.map);
          }}
        >
          {map => (
            <React.Fragment>
              {/* Controls */}
              <MapControls customClass="c-map-controls">
                <ZoomControl map={map} />

                {!embed && <ShareControl />}

                <BasemapControl
                  basemap={basemap}
                  labels={labels}
                  boundaries={boundaries}
                  onChangeBasemap={this.props.setMapBasemap}
                  onChangeLabels={this.props.setMapLabels}
                  onChangeBoundaries={this.props.setMapBoundaries}
                />
                <SearchControl setMapLocation={this.props.setMapBoundaries} />
              </MapControls>

              {/* Popup */}
              <MapPopup
                map={map}
                latlng={layerGroupsInteractionLatLng}
                data={{
                  layers: activeLayers.filter(l =>
                    !!l.interactionConfig && !!l.interactionConfig.output
                    && !!l.interactionConfig.output.length),
                  layersInteraction: layerGroupsInteraction,
                  layersInteractionSelected: layerGroupsInteractionSelected
                }}
                onReady={(popup) => {
                  this.popup = popup;
                }}
              >
                <LayerPopup
                  onChangeInteractiveLayer={selected =>
                    this.props.setMapLayerGroupsInteractionSelected(selected)}
                />
              </MapPopup>

              {/* LayerManager */}
              <LayerManager map={map} plugin={PluginLeaflet}>
                {(activeLayers || []).map((l, i) => (
                  <Layer
                    {...l}
                    key={l.id}
                    opacity={l.opacity}
                    zIndex={1000 - i}
                    // Interaction
                    {...!!l.interactionConfig &&
                    !!l.interactionConfig.output &&
                    !!l.interactionConfig.output.length && {
                      interactivity:
                        l.provider === 'carto' || l.provider === 'cartodb'
                          ? l.interactionConfig.output.map(o => o.column)
                          : true,
                      events: {
                        click: (e) => {
                          if (this.props.setMapLayerGroupsInteraction) {
                            this.props.setMapLayerGroupsInteraction({
                              ...e,
                              ...l
                            });
                          }
                          if (this.props.setMapLayerGroupsInteractionLatLng) {
                            this.props.setMapLayerGroupsInteractionLatLng(e.latlng);
                          }
                        }
                      }
                    }
                    }
                    {...l.params && { params: l.params }}
                    {...l.sqlParams && { sqlParams: l.sqlParams }}
                    {...l.decodeParams && { decodeParams: l.decodeParams }}
                    {...(l.layerConfig.decoder && CANVAS_DECODERS[l.layerConfig.decoder]) &&
                      { decodeFunction: CANVAS_DECODERS[l.layerConfig.decoder] }}
                  />
                ))
                }
              </LayerManager>
            </React.Fragment>
          )}
        </Map>

        {/* LEGEND */}
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
                  canPlay={false}
                  handleChange={(dates, activeLayer) => {
                    this.onChangeLayerDate(dates, activeLayer);
                  }}
                />
                <LegendItemTimeline
                  onChangeLayer={this.onChangeLayerTimeLine}
                  customClass="rw-legend-timeline"
                  {...LEGEND_TIMELINE_PROPERTIES}
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

export default ExploreMapComponent;
