import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import { LayerManager, Layer } from 'layer-manager/dist/components';
import { PluginLeaflet } from 'layer-manager';
import {
  Map,
  MapPopup,
  MapControls,
  ZoomControl,
  Legend,
  LegendListItem,
  LegendItemTypes
} from 'vizzuality-components';

// components
import LayerPopup from 'components/ui/map/popup/LayerPopup';

// constants
import { BASEMAPS, LABELS } from 'components/ui/map/constants';

const MAP_CONFIG = {
  zoom: 3,
  center: {
    lat: 0,
    lng: 0
  }
};

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

  UNSAFE_componentWillMount() {
    this.handleRefreshPreview();
  }

  componentDidUpdate(prevProps) {
    const { interactions } = this.props;
    const { interactions: prevInteractions } = prevProps;
    const interactionesChanged = !isEqual(interactions, prevInteractions);

    if (interactionesChanged) this.handleRefreshPreview();
  }

  handleRefreshPreview() {
    const { layer, interactions, generateLayerGroups } = this.props;

    generateLayerGroups({ layer, interactions });
  }

  render() {
    const {
      adminLayerPreview,
      interactions,
      layers,
      setLayerInteraction,
      setLayerInteractionLatLng,
      setLayerInteractionSelected
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
          <div className="c-map">
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
                  {/* Controls */}
                  <MapControls
                    customClass="c-map-controls"
                  >
                    <ZoomControl map={map} />
                  </MapControls>

                  {/* Popup */}
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
                        setLayerInteractionSelected(selected);
                      }}
                    />
                  </MapPopup>

                  {/* LayerManager */}
                  <LayerManager map={map} plugin={PluginLeaflet}>
                    {layers.map((l, i) => (
                      <Layer
                        {...l}
                        key={l.id}
                        opacity={l.opacity || 1}
                        zIndex={1000 - i}

                        // Interaction
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
          </div>
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
