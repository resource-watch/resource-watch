import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { VegaChart } from 'widget-editor';

// components
import Spinner from 'components/ui/Spinner';
import DatasetPlaceholderChart from 'components/charts/placeholder-chart';

// utils
import { getDefaultTheme } from 'utils/widget';

const defaultTheme = getDefaultTheme();
const defaultThumbnailTheme = getDefaultTheme(true);

class DatasetWidgetChart extends React.Component {
  static propTypes = {
    widget: PropTypes.object,
    mode: PropTypes.string.isRequired
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
    const { mode, widget } = this.props;

    const themeObj = mode === 'thumbnail' ? defaultThumbnailTheme : defaultTheme;
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
          className="-tiny -light"
        />

        <VegaChart
          data={widget.widgetConfig}
          theme={themeObj}
          showLegend={mode !== 'thumbnail'}
          reloadOnResize
          toggleLoading={this.triggerToggleLoading}
          getForceUpdate={(func) => { this.forceChartUpdate = func; }}
        />
      </div>
    );
  }
}

export default DatasetWidgetChart;
