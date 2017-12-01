import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

// Components
import TextChart from 'components/widgets/charts/TextChart';
import VegaChart from 'components/widgets/charts/VegaChart';
import Map from 'components/widgets/editor/map/Map';
import Legend from 'components/widgets/editor/ui/Legend';

import Title from 'components/widgets/editor/ui/Title';
import Spinner from 'components/widgets/editor/ui/Spinner';

// Utils
import getChartTheme from 'utils/widgets/theme';
import LayerManager from 'components/widgets/editor/helpers/LayerManager';

export default function WidgetBlock({ data, item, onToggleLoading }) {
  const id = `${item.content.widgetId}/${item.id}`;

  if (!data[id]) {
    return null;
  }

  const {
    widget,
    widgetType,
    widgetLoading,
    widgetError,
    layers,
    layersLoading,
    layersError
  } = data[id];

  return (
    <div className="c-dashboard-card">
      <header>
        <div className="header-container">
          <Title className="-default">{widget ? widget.name : '–'}</Title>

          {/* <button
            onClick={this.handleFavouriteClick}
          >
            <Icon name={`icon-${iconName}`} className="c-icon -small" />
          </button> */}
        </div>
        {/* <ul className="categories">
          {this.props.categories.map(category => <li key={category}>{category}</li>)}
        </ul> */}
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
                layerGroup => this.onToggleLayerGroupVisibility(layerGroup)
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
            <div className="error">Unable to load the widget <span>{widgetError || layersError}</span></div>
          </div>
        }
      </div>
    </div>
  );
}

WidgetBlock.propTypes = {
  data: PropTypes.object,
  item: PropTypes.object,
  onToggleLoading: PropTypes.func
};

WidgetBlock.defaultProps = {
  data: {},
  item: {},
  onToggleLoading: null
};
