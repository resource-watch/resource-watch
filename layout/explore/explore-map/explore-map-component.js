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
  LegendItemTimeline
} from 'wri-api-components';

import { LayerManager, Layer } from 'layer-manager/dist/react';
import { PluginLeaflet } from 'layer-manager';

// Modal
import Modal from 'components/modal/modal-component';
import LayerInfoModal from 'components/modal/layer-info-modal';

class ExploreMapComponent extends React.Component {
  static propTypes = {
    embed: PropTypes.bool,

    open: PropTypes.bool,

    zoom: PropTypes.number,
    latLng: PropTypes.object,
    location: PropTypes.object,
    basemap: PropTypes.object,
    labels: PropTypes.object,
    boundaries: PropTypes.bool,
    layerGroups: PropTypes.array,
    layerGroupsInteraction: PropTypes.object,
    layerGroupsInteractionSelected: PropTypes.string,
    layerGroupsInteractionLatLng: PropTypes.object,

    // Actions
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

    setMapLayerGroupsInteraction: PropTypes.func.isRequired,
    setMapLayerGroupsInteractionLatLng: PropTypes.func.isRequired,
    setMapLayerGroupsInteractionSelected: PropTypes.func.isRequired,
    resetMapLayerGroupsInteraction: PropTypes.func.isRequired
  };

  state = {
    layer: null,
    loading: {}
  }

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
  }

  onChangeOpacity = debounce((l, opacity) => {
    this.props.setMapLayerGroupOpacity({ dataset: { id: l.dataset }, opacity });
  }, 250)

  onChangeVisibility = (l, visibility) => {
    this.props.setMapLayerGroupVisibility({ dataset: { id: l.dataset }, visibility });
  }

  onChangeLayer = (l) => {
    this.props.setMapLayerGroupActive({ dataset: { id: l.dataset }, active: l.id });
  }

  onRemoveLayer = (l) => {
    this.props.toggleMapLayerGroup({ dataset: { id: l.dataset }, toggle: false });
  }

  onChangeOrder = (datasetIds) => {
    this.props.setMapLayerGroupsOrder({ datasetIds });
  }

  // Map params
  onMapParams = debounce(({ zoom, latLng }) => {
    this.props.setMapZoom(zoom);
    this.props.setMapLatLng(latLng);
  }, 250)

  onLayerLoading = (id, bool) => {
    this.setState({
      loading: {
        ...this.state.loading,
        [id]: bool
      }
    });
  }

  render() {
    const {
      embed,
      zoom,
      latLng,
      bbox,
      location,
      basemap,
      labels,
      boundaries,
      layerGroups,
      layerGroupsInteraction,
      layerGroupsInteractionSelected,
      layerGroupsInteractionLatLng
    } = this.props;

    const activeLayers = layerGroups.map(lg => ({
      ...lg.layers.find(l => l.active),
      opacity: (typeof lg.opacity !== 'undefined') ? lg.opacity : 1,
      visibility: (typeof lg.visibility !== 'undefined') ? lg.visibility : true
    }));

    return (
      <div className="l-map -relative">
        {/* Spinner */}
        {Object.keys(this.state.loading)
          .map(k => this.state.loading[k])
          .some((l => !!l)) &&
          <Spinner isLoading />
        }

        {/* Map */}
        <div className="c-map">
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
            onReady={(map) => { this.map = map; console.info(this.map); }}
          >
            {map => (
              <React.Fragment>
                {/* Controls */}
                <MapControls
                  customClass="c-map-controls"
                >
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
                  <SearchControl />
                </MapControls>

                {/* Popup */}
                <MapPopup
                  map={map}
                  latlng={layerGroupsInteractionLatLng}
                  data={{
                    layers: activeLayers.filter(l => !!l.interactionConfig && !!l.interactionConfig.output && !!l.interactionConfig.output.length),
                    layersInteraction: layerGroupsInteraction,
                    layersInteractionSelected: layerGroupsInteractionSelected
                  }}
                  onReady={(popup) => { this.popup = popup; }}
                >
                  <LayerPopup
                    onChangeInteractiveLayer={selected => this.props.setMapLayerGroupsInteractionSelected(selected)}
                  />
                </MapPopup>

                {/* LayerManager */}
                <LayerManager map={map} plugin={PluginLeaflet}>
                  {layerManager => activeLayers && activeLayers.map((l, i) => (
                    <Layer
                      {...l}
                      key={l.id}
                      layerManager={layerManager}
                      opacity={l.opacity}
                      zIndex={1000 - i}

                      // Interaction
                      {...!!l.interactionConfig && !!l.interactionConfig.output && !!l.interactionConfig.output.length && {
                        interactivity: (l.provider === 'carto' || l.provider === 'cartodb') ? l.interactionConfig.output.map(o => o.column) : true,
                        events: {
                          click: (e) => {
                            if (this.props.setMapLayerGroupsInteraction) this.props.setMapLayerGroupsInteraction({ ...e, ...l });
                            if (this.props.setMapLayerGroupsInteractionLatLng) this.props.setMapLayerGroupsInteractionLatLng(e.latlng);
                          }
                        }
                      }}

                    // There is a bug here... Too many setState
                    // onLayerLoading={bool => this.onLayerLoading(l.id, bool)}
                    />
                  ))}
                </LayerManager>
              </React.Fragment>
            )}
          </Map>
        </div>

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
                  (embed) ?
                    <LegendItemToolbar>
                      <LegendItemButtonLayers />
                      <LegendItemButtonOpacity />
                      <LegendItemButtonVisibility />
                      <LegendItemButtonInfo />
                    </LegendItemToolbar> :

                    <LegendItemToolbar />
                }
                // Actions
                onChangeInfo={this.onChangeInfo}
                onChangeOpacity={this.onChangeOpacity}
                onChangeVisibility={this.onChangeVisibility}
                onChangeLayer={this.onChangeLayer}
                onRemoveLayer={this.onRemoveLayer}
              >
                <LegendItemTypes />
                <LegendItemTimeline onChangeLayer={this.onChangeLayer} />
              </LegendListItem>
            ))}
          </Legend>
        </div>

        {!!this.state.layer &&
          <Modal
            isOpen={!!this.state.layer}
            className="-medium"
            onRequestClose={() => this.onChangeInfo(null)}
          >
            <LayerInfoModal
              layer={this.state.layer}
            />
          </Modal>
        }
      </div>
    );
  }
}

export default ExploreMapComponent;
