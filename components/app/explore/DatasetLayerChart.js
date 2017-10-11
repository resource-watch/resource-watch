import React from 'react';
import PropTypes from 'prop-types';
import LayerChart from 'components/widgets/charts/LayerChart';
import Spinner from 'components/ui/Spinner';

class DatasetLayerChart extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    // BINDINGS
    this.triggerToggleLoading = this.triggerToggleLoading.bind(this);
  }

  triggerToggleLoading(loading) {
    this.setState({ loading });
  }

  render() {
    const layerConfig = this.props.layer.layerConfig;

    return (
      <div className="c-layer-chart">
        <Spinner
          isLoading={this.state.loading}
          className="-light"
        />
        <LayerChart
          data={layerConfig}
          toggleLoading={this.triggerToggleLoading}
        />
      </div>
    );
  }
}

DatasetLayerChart.propTypes = {
  layer: PropTypes.object
};

export default DatasetLayerChart;
