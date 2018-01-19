import React from 'react';
import PropTypes from 'prop-types';

// Components
import VegaChart from 'components/widgets/charts/VegaChart';
import TextChart from 'components/widgets/charts/TextChart';
import Map from 'components/widgets/editor/map/Map';
import Legend from 'components/ui/Legend';

import Icon from 'components/ui/Icon';
import Title from 'components/ui/Title';
import Spinner from 'components/ui/Spinner';

// Utils
import getChartTheme from 'utils/widgets/theme';
import LayerManager from 'components/widgets/editor/helpers/LayerManager';

export default function WidgetBlock({
  user,
  data,
  item,
  onToggleFavourite,
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
    layersError,
    favourite,
    favouriteLoading
  } = data[id];

  return (
    <div className="c-dashboard-card">
      <header>
        <div className="header-container">
          <Title className="-default">{widget ? widget.name : '–'}</Title>

          <div className="buttons">
            {user.token &&
              <button
                type="button"
                onClick={() => onToggleFavourite(favourite, widget)}
              >
                {!favouriteLoading &&
                  <Icon name={`icon-${favourite.id ? 'star-full' : 'star-empty'}`} className="c-icon -small" />
                }

                {favouriteLoading &&
                  <Spinner isLoading className="-transparent -tiny -inline" />
                }
              </button>
            }

            <button
              type="button"
              onClick={() => onToggleModal(!widgetModal)}
            >
              {!widgetModal &&
                <Icon name="icon-info" className="c-icon -small" />
              }

              {widgetModal &&
                <Icon name="icon-cross" className="c-icon -small" />
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
  onToggleFavourite: PropTypes.func,
  onToggleLoading: PropTypes.func,
  onToggleLayerGroupVisibility: PropTypes.func
};

WidgetBlock.defaultProps = {
  user: {},
  data: {},
  item: {},
  onToggleModal: null,
  onToggleFavourite: null,
  onToggleLoading: null,
  onToggleLayerGroupVisibility: null
};
