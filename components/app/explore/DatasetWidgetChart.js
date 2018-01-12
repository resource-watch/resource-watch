import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components
import VegaChart from 'components/widgets/charts/VegaChart';
import Spinner from 'components/ui/Spinner';
import DatasetPlaceholderChart from 'components/app/explore/DatasetPlaceholderChart';

// Helpers
import ChartTheme from 'utils/widgets/theme';

class DatasetWidgetChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: props.widget,
      loading: false,
      error: false
    };

    // BINDINGS
    this.triggerToggleLoading = this.triggerToggleLoading.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      widget: nextProps.widget
    });
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
    const { widgetConfig } = this.state.widget;
    const { mode } = this.props;
    const themeObj = ChartTheme(mode === 'thumbnail');
    const classname = classnames({
      'c-widget-chart': true,
      '-thumbnail': (mode === 'thumbnail')
    });

    if (this.state.error) {
      return <DatasetPlaceholderChart />;
    }

    return (
      <div className={classname}>
        <Spinner
          isLoading={this.state.loading}
          className="-light"
        />
        <VegaChart
          data={widgetConfig}
          theme={themeObj}
          showLegend={mode !== 'thumbnail'}
          reloadOnResize={mode !== 'thumbnail'}
          toggleLoading={this.triggerToggleLoading}
          getForceUpdate={(func) => { this.forceChartUpdate = func; }}
          onError={() => this.setState({ error: true })}
        />
        <div className="actions">
          
        </div>
      </div>
    );
  }
}

DatasetWidgetChart.propTypes = {
  mode: PropTypes.string.isRequired,
  // STATE
  widget: PropTypes.object
};

export default DatasetWidgetChart;
