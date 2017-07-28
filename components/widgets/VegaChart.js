import React from 'react';
import PropTypes from 'prop-types';
import { bisector } from 'd3';
import vega from 'vega';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import isEqual from 'lodash/isEqual';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { toggleTooltip } from 'redactions/tooltip';

// Components
import VegaChartTooltip from './VegaChartTooltip';
import VegaChartLegend from './VegaChartLegend';

class VegaChart extends React.Component {

  constructor(props) {
    super(props);

    // BINDINGS
    this.triggerResize = debounce(this.triggerResize.bind(this), 250);
  }

  componentDidMount() {
    this.mounted = true;
    this.renderChart();
    window.addEventListener('resize', this.triggerResize);
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps.data, this.props.data);
  }

  componentDidUpdate() {
    // We should check if the data has changed
    this.renderChart();
  }

  componentWillUnmount() {
    this.mounted = false;
    window.removeEventListener('resize', this.triggerResize);
  }

  /**
   * Event handler executed when the mouse goes out of the chart
   */
  onMouseOut() {
    // Right after this instruction, we hide the tooltip
    // Nevertheless, because the onMouseMove is throttled, an
    // execution might be delayed causing the tooltip from
    // leaking out of the chart container
    // The solution is to cancel any further executions at
    // this point
    if (this.throttledMouseMove) this.throttledMouseMove.cancel();

    // We hide the tooltip
    this.props.toggleTooltip(false);
  }

  /**
   * Event handler for the mouse move events on the chart
   * @param {object} vegaConfig Vega configuration of the chart
   * @param {object[]} visData Data fetched by Vega and used to draw the chart
   * @param {string|number} x x value associated with the position of the cursor
   * @param {object} item Data associated with the hovered mark, if exist
   */
  onMousemove(vegaConfig, visData, x, item) {
    // Regarding the Vega configuration, check if a column is a date
    const isDate = (columnName) => { // eslint-disable-line arrow-body-style
      return vegaConfig
        && vegaConfig.data[0].format
        && vegaConfig.data[0].format.parse
        && vegaConfig.data[0].format.parse[columnName] === 'date';
    };

    // Return the type of the data passed as argument
    const getType = (columnName, val) => {
      // We need to check the type date before the number one
      // because a date could be a timestamp
      if (val instanceof Date || isDate(columnName)) return 'date';
      if (typeof val === 'number') return 'number';
      return 'string';
    };

    // Return the label of the specified column
    const getLabel = (columnName) => {
      if (!vegaConfig) return null;

      const axis = vegaConfig.axes.find(a => a.type === columnName);
      if (!axis) return null;

      return axis.name;
    };


    // If the cursor is on top of a mark, we display the data
    // associated to that mark
    // The only exception is for the lines because the data
    // they own is always the first one (first point)
    if (!isEmpty(item) && item.datum.x && item.mark.marktype !== 'line') {
      return this.props.toggleTooltip(true, {
        follow: true,
        direction: 'bottom',
        children: VegaChartTooltip,
        childrenProps: {
          item: {
            x: {
              type: getType('x', item.datum.x),
              label: getLabel('x'),
              value: item.datum.x
            },
            y: {
              type: getType('y', item.datum.y),
              label: getLabel('y'),
              value: item.datum.y
            }
          }
        }
      });
    }

    // If the chart doesn't have an x axis, if the data is undefined,
    // if the x value is null [1] or if the chart is a scatter plot [2],
    // we don't determine the data to show in the tooltip depending
    // on the x position of the cursor (based on the x scale)
    // We actually hide the tooltip
    //
    // [1] Null or undefined values can arise from the padding of
    //     the charts
    // [2] As the scatter plot can have several points at the same
    //     x position, we want to avoid showing the data of a
    //     random point when not hovering a dot
    const hasXAxis = !!(vegaConfig.axes && vegaConfig.axes.find(axis => axis.type === 'x'));
    const isScatter = vegaConfig.marks.length === 1 && vegaConfig.marks[0].type === 'symbol';
    if (!hasXAxis || !visData || x === undefined || x === null || isScatter) {
      return this.props.toggleTooltip(false);
    }

    // d3's bisector function needs sorted data because it
    // determines the closest index using with a log2(n)
    // complexity (i.e. splitting the array in two in each
    // iteration)
    const sortedVisData = visData.sort((d1, d2) => d1.x - d2.x);

    // If not, then we retrieve the x position of the cursor,
    // and display the data of the closest point/line/bar
    let data; // eslint-disable-line no-shadow
    if (getType('x', x) === 'string') data = visData.find(d => d.x === x);
    if (getType('x', x) === 'number') {
      const bisectDate = bisector(d => d.x).left;
      const i = bisectDate(sortedVisData, x, 1);
      const d0 = visData[i - 1];
      const d1 = visData[i];
      data = (d0 && d1 && (x - d0.x > d1.x - x)) ? d1 : d0;
    }
    if (getType('x', x) === 'date') {
      const timestamp = x.getTime ? x.getTime() : x;
      const bisectDate = bisector(d => d.x).left;
      const i = bisectDate(sortedVisData, timestamp, 1);
      const d0 = visData[i - 1];
      const d1 = visData[i];
      data = (d0 && d1 && (timestamp - d0.x > d1.x - timestamp)) ? d1 : d0;
    }

    if (data) {
      return this.props.toggleTooltip(true, {
        follow: true,
        direction: 'bottom',
        children: VegaChartTooltip,
        childrenProps: {
          item: {
            x: {
              type: getType('x', x), // Don't use data.x here
              label: getLabel('x'),
              value: data.x,
              range: getType('x', x) === 'date'
                // We don't need to pass the full array
                ? [sortedVisData[0].x, sortedVisData[sortedVisData.length - 1].x]
                : []
            },
            y: {
              type: getType('y', data.y),
              label: getLabel('y'),
              value: data.y,
              range: getType('y', data.y) === 'date'
                // We don't need to pass the full array
                ? [sortedVisData[0].y, sortedVisData[sortedVisData.length - 1].y]
                : []
            }
          }
        }
      });
    }

    return null;
  }

  setSize() {
    if (this.chartViewportContainer) {
      this.width = this.chartViewportContainer.offsetWidth;
      this.height = this.chartViewportContainer.offsetHeight;
    }
  }

  /**
   * Return the Vega configuration of the chart
   * This method is necessary because we need to define the size of
   * the chart, as well as a signal to display a tooltip
   * @returns {object}
   */
  getVegaConfig() {
    const padding = this.props.data.padding || { top: 20, right: 20, bottom: 20, left: 20 };
    const size = {
      // Please don't change these conditions, the bar chart
      // needs its height and width to not be overriden to display
      // properly
      width: this.props.data.width || (this.width - padding.left - padding.right),
      height: this.props.data.height || (this.height - padding.top - padding.bottom)
    };

    // This signal is used for the tooltip
    const signal = {
      /* eslint-disable */
      "name": "onMousemove",
      "streams": [{
        "type": "mousemove",
        "expr": "{ x: iscale('x', eventX()), item: eventItem() }"
      }]
      /* eslint-enable */
    };

    const config = Object.assign({}, this.props.data, size);

    // If the configuration already has signals, we don't override it
    // but push a new one instead
    if (config.signals) {
      config.signals.push(signal);
    } else {
      config.signals = [signal];
    }

    return config;
  }

  /**
   * Toggle the visibility of the loader depending of the
   * passed value
   * @param {boolean} isLoading
   */
  toggleLoading(isLoading) {
    if (this.mounted && this.props.toggleLoading) {
      this.props.toggleLoading(isLoading);
    }
  }

  parseVega() {
    const theme = this.props.theme || {};
    const vegaConfig = this.getVegaConfig();

    // While Vega parses the configuration and renders the chart
    // we display a loader
    this.toggleLoading(true);

    vega.parse.spec(vegaConfig, theme, (err, chart) => {
      // If there's an error or the component has been unmounted
      // we don't do anything
      if (err || !this.mounted) return;

      // We render the chart
      const vis = chart({ el: this.chart, renderer: 'canvas' });
      vis.update();

      // We toggle off the loader once we've rendered the chart
      this.toggleLoading(false);

      // Data fetched by Vega and used to draw the chart
      const data = vis.data().table;

      // We display a tooltip at maximum 30 FPS (approximatively)
      // We save the throttled function in a global variable so
      // we can eventually cancel pending executions when the
      // cursor goes out of the chart's container
      this.throttledMouseMove = throttle((_, { x, item }) => {
        this.onMousemove(vegaConfig, data, x, item);
      }, 30);

      vis.onSignal('onMousemove', this.throttledMouseMove);
    });
  }

  triggerResize() {
    if (this.props.reloadOnResize) {
      this.renderChart();
    }
  }

  renderChart() {
    this.setSize();
    this.parseVega();
  }

  render() {
    const vegaConfig = this.getVegaConfig();

    return (
      <div
        className="c-chart"
        onMouseOut={() => this.onMouseOut()}
        ref={(el) => { this.chartViewportContainer = el; }}
      >
        <div ref={(c) => { this.chart = c; }} className="chart" />
        { vegaConfig.legend && <VegaChartLegend config={vegaConfig.legend} /> }
      </div>
    );
  }
}

VegaChart.propTypes = {
  reloadOnResize: PropTypes.bool.isRequired,
  // Define the chart data
  data: PropTypes.object,
  theme: PropTypes.object,
  // Callbacks
  toggleLoading: PropTypes.func,
  toggleTooltip: PropTypes.func
};

const mapStateToProps = ({ tooltip }) => ({
  tooltip
});

const mapDispatchToProps = dispatch => ({
  toggleTooltip: (visibility, options) => dispatch(toggleTooltip(visibility, options))
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(VegaChart);
