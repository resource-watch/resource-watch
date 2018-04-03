import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { Link } from 'routes';

import ToggleFavorite from 'components/favorites/ToggleFavorite';

// Thumbnails charts
import WidgetChart from 'components/charts/widget-chart';
import LayerChart from 'components/charts/layer-chart';
import PlaceholderChart from 'components/charts/placeholder-chart';

class DatasetListItem extends React.Component {
  static propTypes = {
    // STATE
    dataset: PropTypes.object,
    favourites: PropTypes.array,
    widget: PropTypes.object,
    layer: PropTypes.object,
    metadata: PropTypes.object,
    mode: PropTypes.string,
    user: PropTypes.object,
    toggleFavourite: PropTypes.func,
    tags: PropTypes.node,
    actions: PropTypes.node
  };

  renderChart = () => {
    const {
      dataset, widget, layer, mode
    } = this.props;

    const isWidgetMap = widget && widget.widgetConfig.type === 'map';

    if (mode !== 'grid') return null;

    if (widget && !isWidgetMap) {
      return (
        <div className="list-item-chart">
          <WidgetChart widget={widget} mode="thumbnail" />
        </div>
      );
    } else if (layer || isWidgetMap) {
      return (
        <div className="list-item-chart">
          <LayerChart layer={layer} />
        </div>
      );
    }

    return (
      <div className="list-item-chart">
        <Link route="explore_detail" params={{ id: dataset.id }}>
          <a>
            <PlaceholderChart />
          </a>
        </Link>
      </div>
    );
  }

  render() {
    const {
      dataset, metadata, mode, actions, tags
    } = this.props;

    return (
      <div className={`c-dataset-list-item -${mode}`}>
        {/* CHART */}
        {this.renderChart()}

        {/* INFO */}
        <div className="info">
          <div className="detail">
            {/* Title */}
            <div className="title-container">
              <h4>
                <Link
                  route="explore_detail"
                  params={{ id: this.props.dataset.id }}
                >
                  <a>
                    {(metadata && metadata.info && metadata.info.name) || dataset.name}
                  </a>
                </Link>

                <ToggleFavorite data={dataset} type="dataset" />

              </h4>
            </div>

            {/* Source */}
            <div className="metadata-container">
              {metadata && metadata.source &&
                <p>Source: {metadata.source}</p>
              }
            </div>

            {!!tags &&
              React.cloneElement(
                tags,
                { ...this.props }
              )
            }
          </div>

          {!!actions &&
            React.cloneElement(
              actions,
              { ...this.props }
            )
          }
        </div>
      </div>
    );
  }
}

export default DatasetListItem;
