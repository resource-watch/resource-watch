import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import flatten from 'lodash/flatten';

// Components
import LayoutEmbed from 'layout/layout/layout-embed';

import {
  Map,
  MapControls,
  MapSideBySide,
  ZoomControl,
  Legend,
  LegendListItem,
  LegendItemTypes
} from 'wri-api-components';

import { LayerManager, Layer } from 'layer-manager/dist/react';
import { PluginLeaflet } from 'layer-manager';

import { BASEMAPS, LABELS } from 'components/ui/map/constants';

class EmbedMapSwipe extends React.Component {
  static propTypes = {
    layerGroups: PropTypes.array,
    zoom: PropTypes.number,
    latLng: PropTypes.object,
    isLoadedExternally: PropTypes.bool
  };

  static defaultProps = {
    layerGroups: [],
    zoom: 3,
    latLng: { lat: 0, lng: 0 }
  };

  render() {
    const {
      zoom,
      latLng,
      layerGroups,
      isLoadedExternally
    } = this.props;

    return (
      <LayoutEmbed
        title="Map comparison"
        description=""
      >
        <div className="c-embed-widget">
          {/* <div className="widget-title">
            Map comparison
          </div> */}

          <div
            className={classnames({
              'widget-content': true,
              '-external': isLoadedExternally
            })}
          >
            <div>
              <div className="c-map">
                <Map
                  mapOptions={{
                    zoom,
                    center: latLng
                  }}
                  basemap={{
                    url: BASEMAPS.dark.value,
                    options: BASEMAPS.dark.options
                  }}
                  label={{
                    url: LABELS.light.value,
                    options: LABELS.light.options
                  }}
                >
                  {map => (
                    <React.Fragment>
                      {/* Controls */}
                      <MapControls
                        customClass="c-map-controls -embed"
                      >
                        <ZoomControl map={map} />
                      </MapControls>

                      {/* LayerManager */}
                      <LayerManager map={map} plugin={PluginLeaflet}>
                        {layerManager => layerGroups && flatten(layerGroups.map(lg => lg.layers.filter(l => l.active === true))).map((l, i) => (
                          <Layer
                            layerManager={layerManager}
                            {...l}
                            key={l.id}
                            zIndex={1000 - i}

                            onReady={(layers) => {
                              const setLayers = {
                                0: 'setLeftLayers',
                                1: 'setRightLayers'
                              };

                              layers.forEach((lm, index) => {
                                const { mapLayer } = lm;
                                if (mapLayer.group) {
                                  mapLayer.getLayers().forEach((ml, j) => {
                                    if (j === 0) {
                                      this.sideBySide[setLayers[index]](ml);
                                    }
                                  });
                                } else {
                                  this.sideBySide[setLayers[index]](mapLayer);
                                }
                              });
                            }}
                          />
                        ))}
                      </LayerManager>
                      
                      {/* MapSideBySide */}
                      <MapSideBySide
                        map={map}
                        onReady={(sideBySide) => { this.sideBySide = sideBySide; }}
                      />
                    </React.Fragment>
                  )}
                </Map>
              </div>
            </div>
          </div>

          <div className="widget-content-row">
            {layerGroups.map((lg, i) => (
              <Legend
                key={lg.dataset}
                maxWidth="50%"
                maxHeight={150}
                sortable={false}
                collapsable={false}
              >
                <LegendListItem
                  index={i}
                  key={lg.dataset}
                  layerGroup={lg}
                >
                  <LegendItemTypes />
                </LegendListItem>
              </Legend>
            ))}
          </div>

          {/* {isLoadedExternally && (
            <div className="widget-footer">
              <div className="widget-footer">
                Powered by
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <img
                    className="embed-logo"
                    src="/static/images/logo-embed.png"
                    alt="Resource Watch"
                  />
                </a>
              </div>
            </div>
          )} */}

        </div>
      </LayoutEmbed>
    );
  }
}

export default EmbedMapSwipe;
