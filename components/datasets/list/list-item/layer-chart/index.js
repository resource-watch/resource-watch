import React from 'react';
import PropTypes from 'prop-types';
import LayerChart from 'components/widgets/charts/LayerChart';
import Spinner from 'components/ui/Spinner';

class DatasetLayerChart extends React.PureComponent {
  static propTypes = {
    layer: PropTypes.object
  };

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
    const { layer } = this.props;

    return (
      <div className="c-layer-chart">
        <Spinner
          isLoading={this.state.loading}
          className="-light"
        />
        <LayerChart
          data={layer.layerConfig}
          toggleLoading={this.triggerToggleLoading}
        />
      </div>
    );
  }
}

export default DatasetLayerChart;
