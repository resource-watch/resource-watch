import React from 'react';
import { bisector } from 'd3';
import vega from 'vega';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import VegaChartTooltip from './VegaChartTooltip';

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

  setSize() {
    if (this.chart) {
      this.width = this.chart.offsetWidth;
      this.height = this.chart.offsetHeight;
    }
  }

  parseVega() {
    const theme = this.props.theme || {};
    const padding = this.props.data.padding || { top: 20, right: 20, bottom: 20, left: 20 };
    const size = {
      width: this.width - padding.left - padding.right,
      height: this.height - padding.top - padding.bottom
    };

    const signals = {
      signals: [{
        name: 'onMousemove',
        streams: [{
          type: 'mousemove',
          expr: 'eventX()',
          scale: {
            name: 'x',
            invert: true
          }
        }]
      }]
    };

    const data = Object.assign({}, this.props.data, size, signals);

    if (this.mounted && this.props.toggleLoading) this.props.toggleLoading(true);

    vega.parse.spec(data, theme, (err, chart) => {
      if (this.mounted && this.props.toggleLoading) this.props.toggleLoading(false);
      if (!err && this.mounted) {
        const vis = chart({
          el: this.chart,
          renderer: 'canvas'
        });

        vis.update();

        // Tooltip
        vis.onSignal('onMousemove', (event, x0) => {
          const visData = vis.data().table;
          let item;

          if (typeof x0 === 'string') {
            item = visData.find(d => d.x === x0);
          }

          if (typeof x0 === 'number') {
            const bisectDate = bisector(d => d.x).left;
            const i = bisectDate(visData, x0, 1);
            const d0 = visData[i - 1];
            const d1 = visData[i];
            item = (d0 && d1 && (x0 - d0.x > d1.x - x0)) ? d1 : d0;
          }

          if (item) {
            return this.props.toggleTooltip(true, {
              follow: true,
              children: VegaChartTooltip,
              childrenProps: {
                item
              }
            });
          }
          return null;
        });
      }
    });
  }

  triggerResize() {
    this.renderChart();
  }

  renderChart() {
    this.setSize();
    this.parseVega();
  }

  render() {
    return (
      <div className="c-chart" onMouseOut={() => this.props.toggleTooltip(false)}>
        <div ref={(c) => { this.chart = c; }} className="chart" />
      </div>
    );
  }
}

VegaChart.propTypes = {
  // Define the chart data
  data: React.PropTypes.object,
  theme: React.PropTypes.object,
  toggleLoading: React.PropTypes.func,
  toggleTooltip: React.PropTypes.func
};

export default VegaChart;
