import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Redux
import { Link } from 'routes';

// Components
import Icon from 'components/ui/icon';
import LoginRequired from 'components/ui/login-required';

// Responsive
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';

// Tooltip
import { Tooltip } from 'vizzuality-components';
import CollectionsPanel from 'components/collections-panel';
import { getTooltipContainer } from 'utils/tooltip';

// helpers
import { belongsToACollection } from 'components/collections-panel/collections-panel-helpers';

// Thumbnails charts
import WidgetChart from 'components/charts/widget-chart';
import LayerChart from 'components/charts/layer-chart';
import PlaceholderChart from 'components/charts/placeholder-chart';

// Utils
import { getDateConsideringTimeZone } from 'utils/utils';

class DatasetListItem extends React.Component {
  static propTypes = {
    // STATE
    dataset: PropTypes.object,
    widget: PropTypes.object,
    layer: PropTypes.object,
    metadata: PropTypes.object,
    mode: PropTypes.string,
    user: PropTypes.object,
    tags: PropTypes.node,
    actions: PropTypes.node,
    responsive: PropTypes.object
  };

  static defaultProps = { mode: 'grid' }

  /**
   * HELPER
   * - renderChart
  */
  renderChart = () => {
    const { dataset, widget, layer, mode } = this.props;

    const isWidgetMap = widget && widget.widgetConfig.type === 'map';
    const isEmbedWidget = widget && widget.widgetConfig.type === 'embed';

    if (mode !== 'grid') return null;

    if (widget && !isWidgetMap && !isEmbedWidget) {
      return (
        <div className="list-item-chart">
          <WidgetChart widget={widget} thumbnail={true} />
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
        <Link route="explore" params={{ dataset: dataset.slug }}>
          <a>
            <PlaceholderChart />
          </a>
        </Link>
      </div>
    );
  }

  render() {
    const { dataset, metadata, mode, user, actions, tags, responsive } = this.props;

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

    const dateLastUpdated = getDateConsideringTimeZone(dataset.dataLastUpdated);

    return (
      <div className={`c-dataset-list-item -${mode}`}>
        {/* CHART */}
        <MediaQuery
          minDeviceWidth={breakpoints.medium}
          values={{ deviceWidth: responsive.fakeWidth }}
        >
          {this.renderChart()}
        </MediaQuery>

        {/* CHART MOBILE */}
        <MediaQuery
          maxDeviceWidth={breakpoints.medium}
          values={{ deviceWidth: responsive.fakeWidth }}
        >
          <Link
            route="explore"
            params={{ id: this.props.dataset.slug }}
          >
            {this.renderChart()}
          </Link>
        </MediaQuery>

        {/* INFO */}
        <div className="info">
          <div className="detail">
            {/* Title */}
            <div className="title-container">
              <h4>
                <Link
                  route="explore"
                  params={{ dataset: this.props.dataset.slug }}
                >
                  <a>
                    {(metadata && metadata.info && metadata.info.name) || dataset.name}
                  </a>
                </Link>

                {/* Favorite dataset icon */}
                <LoginRequired>
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
                    getTooltipContainer={getTooltipContainer}
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

            {/* Last update */}
            <div className="last-update-container">
              {dateLastUpdated &&
                <p>Last update: {dateLastUpdated}</p>
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
