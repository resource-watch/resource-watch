import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Redux
import { Link } from 'routes';

// Components
import Icon from 'components/ui/Icon';
import LoginRequired from 'components/ui/login-required';

// Tooltip
import { Tooltip } from 'wri-api-components';
import CollectionsPanel from 'components/collections-panel';

// helpers
import { belongsToACollection } from 'components/collections-panel/collections-panel-helpers';

// Thumbnails charts
import WidgetChart from 'components/charts/widget-chart';
import LayerChart from 'components/charts/layer-chart';
import PlaceholderChart from 'components/charts/placeholder-chart';

class DatasetListItem extends React.Component {
  static propTypes = {
    // STATE
    dataset: PropTypes.object,
    widget: PropTypes.object,
    layer: PropTypes.object,
    metadata: PropTypes.object,
    vocabulary: PropTypes.object,
    tags: PropTypes.array,
    mode: PropTypes.string,
    user: PropTypes.object,
    actions: PropTypes.object,

    // CALLBACKS
    onTagSelected: PropTypes.func,

    // ACTIONS
    fetchTags: PropTypes.func,
    resetTags: PropTypes.func
  };

  /**
   * HELPER
   * - getTooltipContainer
  */
  getTooltipContainer() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      if (document.querySelector('.sidebar-content')) {
        return document.querySelector('.sidebar-content');
      }

      return document.body;
    }

    return null;
  }

  /**
   * HELPER
   * - renderChart
  */
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
      dataset, metadata, vocabulary, mode, user, actions, tags
    } = this.props;


    const isInACollection = belongsToACollection(user, dataset);
    const starIconName = classnames({
      'icon-star-full': isInACollection,
      'icon-star-empty': !isInACollection
    });
    const starIconClass = classnames({
      '-small': true,
      '-filled': isInACollection,
      '-empty': !isInACollection
    });

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

                {/* Favorite dataset icon */}
                <LoginRequired text="Log in or sign up to save items in favorites">
                  <Tooltip
                    overlay={
                      <CollectionsPanel
                        resource={dataset}
                        resourceType="dataset"
                      />
                    }
                    overlayClassName="c-rc-tooltip"
                    placement="bottomRight"
                    trigger="click"
                    getTooltipContainer={this.getTooltipContainer}
                    monitorWindowResize
                  >
                    <button
                      className="c-btn favourite-button"
                      tabIndex={-1}
                    >
                      <Icon
                        name={starIconName}
                        className={starIconClass}
                      />
                    </button>
                  </Tooltip>
                </LoginRequired>
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
