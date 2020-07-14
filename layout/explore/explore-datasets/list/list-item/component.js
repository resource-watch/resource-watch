import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Redux
import { Link, Router } from 'routes';

// Responsive
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';

// Thumbnails charts
import WidgetChart from 'components/charts/widget-chart';
import LayerChart from 'components/charts/layer-chart';
import PlaceholderChart from 'components/charts/placeholder-chart';

// Utils
import { getDateConsideringTimeZone } from 'utils/utils';

import './styles.scss';

class DatasetListItem extends React.Component {
  static propTypes = {
    // STATE
    dataset: PropTypes.object.isRequired,
    widget: PropTypes.object,
    layer: PropTypes.object,
    metadata: PropTypes.object.isRequired,
    actions: PropTypes.node.isRequired,
    responsive: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired,
    expandedChart: PropTypes.bool,
    toggleMapLayerGroup: PropTypes.func.isRequired,
    resetMapLayerGroupsInteraction: PropTypes.func.isRequired,
    setMapLayerGroupActive: PropTypes.func.isRequired
  };

  static defaultProps = {
    layer: null,
    widget: null,
    expandedChart: false
  };

  /**
   * HELPER
   * - renderChart
  */
  renderChart = () => {
    const { dataset, widget, layer, expandedChart } = this.props;

    const isWidgetMap = widget && widget.widgetConfig.type === 'map';
    const isEmbedWidget = widget && widget.widgetConfig.type === 'embed';
    const classNameValue = classnames({
      'list-item-chart': true,
      '-expanded-chart': expandedChart
    });
    

    if (widget && !isWidgetMap && !isEmbedWidget) {
      return (
        <div className={classNameValue}>
          <WidgetChart widget={widget} thumbnail={true} />
        </div>
      );
    } else if (layer || isWidgetMap) {
      return (
        <div className={classNameValue}>
          <LayerChart layer={layer} />
        </div>
      );
    }

    return (
      <div className={classNameValue}>
        <Link route="explore" params={{ dataset: dataset.slug }}>
          <a>
            <PlaceholderChart />
          </a>
        </Link>
      </div>
    );
  }

  handleClick = () => {
    const {
      dataset,
      toggleMapLayerGroup,
      resetMapLayerGroupsInteraction,
      setMapLayerGroupActive,
      layer
    } = this.props;

    Router.pushRoute('explore', { dataset: dataset.slug });

    // Add default layer to the map only if not active already
    if (!this.props.active && layer) {  
      toggleMapLayerGroup({ dataset, toggle: true });
      setMapLayerGroupActive({ dataset: { id: dataset.id }, active: layer.id });
      resetMapLayerGroupsInteraction();
    }
  }

  render() {
    const { dataset, metadata, actions, responsive, active } = this.props;

    const dateLastUpdated = getDateConsideringTimeZone(dataset.dataLastUpdated, true);
    const classNameValue = classnames({
      'c-explore-dataset-list-item': true,
      '-active': active
    });

    return (
      <div
        className={classNameValue}
        role="button"
        tabIndex={0}
        onClick={this.handleClick}
        onKeyPress={this.handleClick}
      >
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
            params={{ dataset: this.props.dataset.slug }}
          >
            {this.renderChart()}
          </Link>
        </MediaQuery>

        {/* INFO */}
        <div className="info">
          <div className="source-date">
            {/* Source */}
            <div
              className="source"
              title={metadata && metadata.source}
            >
              {metadata && metadata.source}
            </div>
            {/* Last update */}
            <div className="date">
              {dateLastUpdated}
            </div>
          </div>

          {/* Title */}
          <div className="title-actions">
            <h4>
              <Link
                route="explore"
                params={{ dataset: this.props.dataset.slug }}
              >
                <a>
                  {(metadata && metadata.info && metadata.info.name) || dataset.name}
                </a>
              </Link>
            </h4>
            {!!actions &&
              React.cloneElement(
                actions,
                { ...this.props }
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

export default DatasetListItem;
