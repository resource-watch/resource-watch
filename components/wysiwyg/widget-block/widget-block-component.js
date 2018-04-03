import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

// Components
import TextChart from 'components/widgets/charts/TextChart';
import ToggleFavorite from 'components/favorites/ToggleFavorite';
import Map from 'components/ui/map/Map';
import {
  Legend,
  LegendItemTypes
} from 'wri-api-components';

import Icon from 'components/ui/Icon';
import Title from 'components/ui/Title';
import Spinner from 'components/ui/Spinner';

// Utils
import LayerManager from 'utils/layers/LayerManager';

// Widget editor
import { VegaChart, getVegaTheme } from 'widget-editor';

class WidgetBlock extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    item: PropTypes.object,
    onToggleModal: PropTypes.func,
    onToggleLoading: PropTypes.func
  };

  static defaultProps = {
    data: {},
    item: {},
    onToggleModal: null,
    onToggleLoading: null
  };

  getMapConfig = (widget) => {
    const { widgetConfig } = widget;
    if (!widgetConfig) return {};

    if (widgetConfig.bbox) {
      return {
        bbox: widgetConfig.bbox
      };
    }

    if (widgetConfig.lat && widgetConfig.lng && widgetConfig.zoom) {
      return {
        zoom: widgetConfig.zoom,
        latLng: {
          lat: widgetConfig.lat,
          lng: widgetConfig.lng
        }
      };
    }

    return {};
  }

  render() {
    const {
      data,
      item,
      onToggleModal,
      onToggleLoading
    } = this.props;

    const id = `${item.content.widgetId}/${item.id}`;

    if (!data[id]) {
      return null;
    }

    const {
      widget,
      widgetType,
      widgetLoading,
      widgetError,
      widgetModal,
      layers,
      layersLoading,
      layersError
    } = data[id];

    const metadataInfo = (widget && (widget.metadata && widget.metadata.length > 0 &&
      widget.metadata[0].attributes.info)) || {};

    const widgetLinks = metadataInfo.widgetLinks || [];
    const widgetIsEmbed = widget && widget.widgetConfig && widget.widgetConfig.type === 'embed';
    const widgetEmbedUrl = widgetIsEmbed && widget.widgetConfig.url;

    const caption = metadataInfo && metadataInfo.caption;

    return (
      <div className="c-widget-block-card">
        <header>
          <div className="header-container">
            <Title className="-default">{widget ? widget.name : '–'}</Title>

            <div className="buttons">
              <ToggleFavorite data={widget} type="widget" />

              <button
                type="button"
                onClick={() => onToggleModal(!widgetModal)}
              >
                {!widgetModal &&
                  <Icon name="icon-info" className="-small" />
                }

                {widgetModal &&
                  <Icon name="icon-cross" className="-small" />
                }
              </button>
            </div>
          </div>
        </header>

        <div className="widget-container">
          <Spinner isLoading={widgetLoading || layersLoading} className="-light -small" />

          {!widgetError && widgetType === 'text' && widget &&
            <TextChart
              widgetConfig={widget.widgetConfig}
              toggleLoading={loading => onToggleLoading(loading)}
            />
          }

          {!widgetError && widgetType === 'vega' && widget.widgetConfig && widget &&
            <VegaChart
              data={widget.widgetConfig}
              theme={getVegaTheme()}
              toggleLoading={loading => onToggleLoading(loading)}
              reloadOnResize
            />
          }

          {widgetIsEmbed &&
            <iframe title="Widget embedd" src={widgetEmbedUrl} width="100%" height="100%" frameBorder="0" />
          }

          {!isEmpty(widget) && !widgetLoading && !widgetError && !layersError && widgetType === 'map' && layers && (
            <div>
              <Map
                mapConfig={this.getMapConfig(widget)}
                LayerManager={LayerManager}
                layerGroups={layers}
              />
              <div className="c-legend-map">
                <Legend
                  maxHeight={140}
                  layerGroups={layers}
                  sortable={false}
                  LegendItemTypes={<LegendItemTypes />}
                />
              </div>
            </div>
          )}

          {!widgetError && !layersError && !item && !item.content.widgetId &&
            <div className="message">
              <div className="no-data">No data</div>
            </div>
          }

          {(widgetError || layersError) &&
            <div className="message">
              <div className="error">Unable to load</div>
            </div>
          }

          {widgetModal &&
            <div className="widget-modal">
              {widget && !widget.description &&
                <p>No additional information is available</p>
              }

              {widget && widget.description && (
                <div>
                  <h4>Description</h4>
                  <p>{widget.description}</p>
                </div>
              )}

              { widgetLinks.length > 0 &&
                <div className="widget-links-container">
                  <h4>Links</h4>
                  <ul>
                    { widgetLinks.map(link => (
                      <li>
                        <a
                          href={link.link}
                          target="_blank"
                        >
                          {link.name}
                        </a>
                      </li>
                            ))}
                  </ul>
                </div>
              }
            </div>
          }
        </div>

        {caption &&
          <div className="caption-container">
            {caption}
          </div>
        }
      </div>
    );
  }
}


export default WidgetBlock;
