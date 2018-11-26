import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import flatten from 'lodash/flatten';

// Components
import {
  Map,
  MapPopup,
  MapControls,
  ZoomControl,
  Legend,
  LegendListItem,
  LegendItemTypes
} from 'wri-api-components';

// Map Popups
import LayerPopup from 'components/ui/map/popup/LayerPopup';

import { LayerManager, Layer } from 'layer-manager/lib/react';
import { PluginLeaflet } from 'layer-manager';

import { BASEMAPS, LABELS } from 'components/ui/map/constants';

// Constants
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
    form: PropTypes.object.isRequired,
    interactions: PropTypes.object.isRequired,
    setLayerInteraction: PropTypes.func.isRequired,
    setLayerInteractionLatLng: PropTypes.func.isRequired,
    setLayerInteractionSelected: PropTypes.func.isRequired,
    generateLayerGroups: PropTypes.func.isRequired
  };

  handleRefreshPreview() {
    const { form, interactions } = this.props;
    this.props.generateLayerGroups({ form, interactions });
  }

  render() {
    const { adminLayerPreview, interactions } = this.props;

    const {
      layerGroups,
      interaction,
      interactionLatLng,
      interactionSelected
    } = adminLayerPreview;


    const { added } = interactions;

    const activeLayers = flatten(layerGroups.map(lg => lg.layers.filter(l => l.active)));

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
                <React.Fragment>
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
                      layers: activeLayers,
                      layersInteraction: interaction,
                      layersInteractionSelected: interactionSelected
                    }}
                    onReady={(popup) => { this.popup = popup; }}
                  >
                    <LayerPopup
                      onChangeInteractiveLayer={selected => this.props.setLayerInteractionSelected(selected)}
                    />
                  </MapPopup>

                  {/* LayerManager */}
                  <LayerManager map={map} plugin={PluginLeaflet}>
                    {layerManager => activeLayers.map((l, i) => (
                      <Layer
                        {...l}
                        key={l.id}
                        layerManager={layerManager}
                        opacity={l.opacity || 1}
                        zIndex={1000 - i}

                        // Interaction
                        {...!!added && !!added.length && {
                          interactivity: (l.provider === 'carto' || l.provider === 'cartodb') ? added.map(o => o.column) : true,
                          params: { update: added.map(o => o.column) },
                          events: {
                            click: (e) => {
                              if (this.props.setLayerInteraction) this.props.setLayerInteraction({ ...e, ...l });
                              if (this.props.setLayerInteractionLatLng) this.props.setLayerInteractionLatLng(e.latlng);
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
        <div className="actions">
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
