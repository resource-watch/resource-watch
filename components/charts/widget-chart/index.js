import React from 'react';
import PropTypes from 'prop-types';

// Widget editor
import Renderer from '@widget-editor/renderer'

// Components
import Spinner from 'components/ui/Spinner';
import DatasetPlaceholderChart from '../placeholder-chart';

class DatasetWidgetChart extends React.Component {
  static propTypes = {
    widget: PropTypes.object.isRequired,
    thumbnail: PropTypes.bool
  };

  static defaultProps = {
    thumbnail: false
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: false
    };

    // BINDINGS
    this.triggerToggleLoading = this.triggerToggleLoading.bind(this);
  }

  componentDidUpdate(previousProps) {
    // If the mode changes, we want to re-render the chart to
    // take full advantage of the width
    // To do so, we need to have the forceChartUpdate
    // function available
    // NOTE: this code should probably stay in componentDidUpdate
    // so we're sure we can compute the new width of the charts
    if (previousProps.mode !== this.props.mode && this.forceChartUpdate) {
      this.forceChartUpdate();
    }
  }

  triggerToggleLoading(loading) {
    this.setState({ loading });
  }

  render() {
    const { thumbnail, widget } = this.props;
    console.log('widget.name', widget.name, 'thumbnail', thumbnail);
    

    if (this.state.error) {
      return <DatasetPlaceholderChart />;
    }
    
    return (
      <div className="c-widget-chart">

        <Spinner
          isLoading={this.state.loading}
          className="-tiny -light"
        />
        <Renderer
          widgetConfig={widget.widgetConfig}
          thumbnail={thumbnail}
        />
      </div>
    );
  }
}

export default DatasetWidgetChart;
