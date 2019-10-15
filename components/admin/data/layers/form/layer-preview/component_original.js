import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import Map from 'components/map';
import LayerManager from 'components/map/layer-manager';
import MapControls from 'components/map/controls';
import ZoomControls from 'components/map/controls/zoom';
import {
  Legend,
  LegendListItem,
  LegendItemTypes
} from 'vizzuality-components';
import isEmpty from 'lodash/isEmpty';

// components
import LayerPopup from 'components/ui/map/popup/LayerPopup';

// constants
import { MAPSTYLES } from 'components/map/constants';

class LayerPreviewComponent extends PureComponent {
  static propTypes = {
    adminLayerPreview: PropTypes.object.isRequired,
    layer: PropTypes.object.isRequired,
    interactions: PropTypes.array.isRequired,
    setLayerInteraction: PropTypes.func.isRequired,
    setLayerInteractionLatLng: PropTypes.func.isRequired,
    setLayerInteractionSelected: PropTypes.func.isRequired,
    generateLayerGroups: PropTypes.func.isRequired
  };


  componentWillMount() {
    this.handleRefreshPreview();
  }

  handleZoom = (zoom) => {
    const { setViewport } = this.props;

    setViewport({
      zoom,
      // transitionDuration is always set to avoid mixing
      // durations of other actions (like flying)
      transitionDuration: 250
    });
  }

  componentDidUpdate(prevProps) {
    const { interactions } = this.props;
    const { interactions: prevInteractions } = prevProps;
    const interactionesChanged = !isEqual(interactions, prevInteractions);

    if (interactionesChanged) this.handleRefreshPreview();
  }

  handleRefreshPreview() {
    const { layer, interactions, generateLayerGroups } = this.props;

    if (!isEmpty(layer)) generateLayerGroups({ layer, interactions });
  }

  render() {
    const {
      adminLayerPreview,
      interactions,
      layers,
      setLayerInteraction,
      setLayerInteractionLatLng
    } = this.props;


    const {
      layerGroups,
      interaction,
      interactionLatLng,
      interactionSelected
    } = adminLayerPreview;

    return (
      <div className="c-field preview-container">
        <h5>Layer preview</h5>
        <div className="map-container">
          <Map
            mapboxApiAccessToken={process.env.RW_MAPBOX_API_TOKEN}
            // onClick={this.onClickLayer}
            interactiveLayerIds={[]}
            mapStyle={MAPSTYLES}
            viewport={viewport}
            // bounds={bounds}
            basemap="dark"
            labels="light"
            // boundaries={boundaries}
            onViewportChange={this.handleViewport}
          >
            {_map => (
              <Fragment>
                <LayerManager
                  map={_map}
                  layers={[]}
                />

                {/* {!isEmpty(layerGroupsInteractionLatLng) && activeLayers.length &&
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
                } */}
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
          {/* <div className="c-map">
            <Map
              mapOptions={MAP_CONFIG}
              basemap={{
                url: BASEMAPS.dark.value,
                options: BASEMAPS.dark.options
              }}
              label={{
                url: LABELS.light.value,
                options: LABELS.light.options
              }}
              scrollZoomEnabled={false}
              onReady={(map) => { this.map = map; }}
            >
              {map => (
                <Fragment>
                  <MapControls
                    customClass="c-map-controls"
                  >
                    <ZoomControl map={map} />
                  </MapControls>

                  <MapPopup
                    map={map}
                    latlng={interactionLatLng}
                    data={{
                      layers,
                      layersInteraction: interaction,
                      layersInteractionSelected: interactionSelected
                    }}
                    onReady={(popup) => { this.popup = popup; }}
                  >
                    <LayerPopup
                      onChangeInteractiveLayer={(selected) => {
                        this.props.setLayerInteractionSelected(selected);
                      }}
                    />
                  </MapPopup>

                  <LayerManager map={map} plugin={PluginLeaflet}>
                    {layers.map((l, i) => (
                      <Layer
                        {...l}
                        key={l.id}
                        opacity={l.opacity || 1}
                        zIndex={1000 - i}

                        {...!!interactions && !!interactions.length && {
                          interactivity: (l.provider === 'carto' || l.provider === 'cartodb') ? interactions.map(o => o.column) : true,
                          params: { update: interactions.map(o => o.column) },
                          events: {
                            click: (e) => {
                              setLayerInteraction({ id: l.id, data: e.data });
                              setLayerInteractionLatLng(e.latlng);
                            }
                          }
                        }}
                      />
                    ))}
                  </LayerManager>
                </Fragment>
              )}
            </Map>
          </div>

          <div className="c-legend-map">
            <Legend
              maxHeight={140}
              sortable={false}
            >
              {layerGroups.map((lg, i) => (
                <LegendListItem
                  index={i}
                  key={lg.dataset}
                  layerGroup={lg}
                >
                  <LegendItemTypes />
                </LegendListItem>
              ))}
            </Legend>
          </div> */}
        </div>
        <div className="c-button-container -j-end layer-preview-actions">
          <button
            type="button"
            className="c-button -primary"
            onClick={() => this.handleRefreshPreview()}
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }
}

export default LayerPreviewComponent;
