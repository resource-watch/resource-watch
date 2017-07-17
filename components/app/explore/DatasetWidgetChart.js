import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components
import VegaChart from 'components/widgets/VegaChart';
import Spinner from 'components/ui/Spinner';

// Themes
import ChartTheme from 'utils/widgets/theme';
import ThumbnailTheme from 'utils/widgets/vega-theme-thumbnails.json'

class DatasetWidgetChart extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      widget: props.widget,
      loading: false
    };

    // BINDINGS
    this.triggerToggleLoading = this.triggerToggleLoading.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      widget: nextProps.widget
    });
  }

  triggerToggleLoading(loading) {
    this.setState({ loading });
  }

  render() {
    const { widgetConfig } = this.state.widget;
    const { mode } = this.props;
    const themeObj = (mode === 'thumbnail') ? ThumbnailTheme : ChartTheme();
    const classname = classnames({
      'c-widget-chart': true,
      '-thumbnail': (mode === 'thumbnail')
    });

    return (
      <div className={classname}>
        <Spinner
          isLoading={this.state.loading}
          className="-light"
        />
        <VegaChart
          data={widgetConfig}
          theme={themeObj}
          reloadOnResize={mode !== 'thumbnail'}
          toggleLoading={this.triggerToggleLoading}
        />
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
