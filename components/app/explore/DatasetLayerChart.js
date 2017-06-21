import React from 'react';
import LayerChart from 'components/widgets/LayerChart';
import Spinner from 'components/ui/Spinner';

class DatasetLayerChart extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      layer: props.layer,
      loading: false
    };

    // BINDINGS
    this.triggerToggleLoading = this.triggerToggleLoading.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      layer: nextProps.layer
    });
  }

  triggerToggleLoading(loading) {
    this.setState({ loading });
  }

  render() {
    const layerConfig = this.state.layer.layerConfig;

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
  // STATE
  layer: React.PropTypes.object
};

export default DatasetLayerChart;
