import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';

// Components
import TextChart from 'components/widgets/charts/TextChart';
import Map from 'components/ui/map/Map';
import {
  Tooltip,
  Legend,
  LegendItemTypes
} from 'wri-api-components';

import LoginRequired from 'components/ui/login-required';

import Icon from 'components/ui/Icon';
import Title from 'components/ui/Title';
import Spinner from 'components/ui/Spinner';
import CollectionsPanel from 'components/collections-panel';

// Utils
import LayerManager from 'utils/layers/LayerManager';

// Widget editor
import { VegaChart, getVegaTheme } from 'widget-editor';

// helpers
import { belongsToACollection } from 'components/collections-panel/collections-panel-helpers';

class WidgetBlock extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    data: PropTypes.object,
    item: PropTypes.object,
    onToggleModal: PropTypes.func,
    onToggleLoading: PropTypes.func
  };

  static defaultProps = {
    user: {},
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
      user,
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

    const isInACollection = belongsToACollection(user, widget);
    const starIconName = classnames({
      'icon-star-full': isInACollection,
      'icon-star-empty': !isInACollection
    });

    return (
      <div className="c-widget-block-card">
        <header>
          <div className="header-container">
            <Title className="-default">{widget ? widget.name : '–'}</Title>

            <div className="buttons">
              <LoginRequired text="Log in or sign up to save items in favorites">
                <Tooltip
                  overlay={<CollectionsPanel
                    resource={widget}
                    resourceType="widget"
                  />}
                  overlayClassName="c-rc-tooltip"
                  overlayStyle={{
                        color: '#fff'
                      }}
                  placement="bottomLeft"
                  trigger="click"
                >
                  <button
                    className="c-btn favourite-button"
                    tabIndex={-1}
                  >
                    <Icon
                      name={starIconName}
                      className="-star -small"
                    />
                  </button>
                </Tooltip>
              </LoginRequired>

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
            <iframe src={widgetEmbedUrl} width="100%" height="100%" frameBorder="0"></iframe>
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
