import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components
import VegaChart from 'components/widgets/charts/VegaChart';
import TextChart from 'components/widgets/charts/TextChart';
import Map from 'components/ui/map/Map';
import Legend from 'components/ui/Legend';
import LoginRequired from 'components/ui/login-required';

import Icon from 'components/ui/Icon';
import Title from 'components/ui/Title';
import Spinner from 'components/ui/Spinner';
import Tooltip from 'rc-tooltip/dist/rc-tooltip';
import CollectionsPanel from 'components/collections-panel';

// Utils
import getChartTheme from 'utils/widgets/theme';
import LayerManager from 'utils/layers/LayerManager';

// helpers
import { belongsToACollection } from 'components/collections-panel/collections-panel-helpers';

export default function WidgetBlock({
  user,
  data,
  item,
  onToggleModal,
  onToggleLoading,
  onToggleLayerGroupVisibility
}) {
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

  const widgetLinks = (widget && (widget.metadata && widget.metadata.length > 0 &&
    widget.metadata[0].attributes.info &&
    widget.metadata[0].attributes.info.widgetLinks)) || [];

  const isInACollection = belongsToACollection(user, widget);
  const starIconName = classnames({
    'icon-star-full': isInACollection,
    'icon-star-empty': !isInACollection
  });

  return (
    <div className="c-dashboard-card">
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
            theme={getChartTheme()}
            toggleLoading={loading => onToggleLoading(loading)}
            reloadOnResize
          />
        }

        {!widgetError && !layersError && widgetType === 'map' && layers && (
          <div>
            <Map
              LayerManager={LayerManager}
              mapConfig={{}}
              layerGroups={layers}
            />
            <Legend
              layerGroups={layers}
              className={{ color: '-dark' }}
              toggleLayerGroupVisibility={
                layerGroup => onToggleLayerGroupVisibility(layerGroup)
              }
              setLayerGroupsOrder={() => {}}
              setLayerGroupActiveLayer={() => {}}
              expanded={false}
              readonly
            />
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
    </div>
  );
}

WidgetBlock.propTypes = {
  user: PropTypes.object,
  data: PropTypes.object,
  item: PropTypes.object,
  onToggleModal: PropTypes.func,
  onToggleLoading: PropTypes.func,
  onToggleLayerGroupVisibility: PropTypes.func
};

WidgetBlock.defaultProps = {
  user: {},
  data: {},
  item: {},
  onToggleModal: null,
  onToggleLoading: null,
  onToggleLayerGroupVisibility: null
};
