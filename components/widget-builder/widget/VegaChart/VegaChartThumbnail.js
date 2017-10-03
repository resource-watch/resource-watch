import React from 'react';
import PropTypes from 'prop-types';
import VegaChart from './VegaChart';
import configSpec from './vega-chart.theme.json';

class VegaChartThumbnail extends React.PureComponent {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    data: PropTypes.object,
    spec: PropTypes.object
  }

  static defaultProps = {
    width: 200,
    height: 180
  }

  render() {
    const { width, height, data, spec } = this.props;
    return (
      <VegaChart
        width={width}
        height={height}
        data={data}
        spec={spec}
        config={configSpec}
      />
    );
  }
}

export default VegaChartThumbnail;
