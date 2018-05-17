import React from 'react';
import PropTypes from 'prop-types';
import MapThumbnail from 'components/ui/map/map-thumbnail';
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
          className="-tiny -light"
        />
        <div className="c-we-chart">
          <MapThumbnail
            layerSpec={layer}
            // toggleLoading={this.triggerToggleLoading}
          />
        </div>
      </div>
    );
  }
}

export default DatasetLayerChart;
