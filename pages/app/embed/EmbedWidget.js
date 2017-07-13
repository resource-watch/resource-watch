import React from 'react';
import { Autobind } from 'es-decorators';

// Layout
import Head from 'components/app/layout/head';

// Components
import Spinner from 'components/ui/Spinner';
import VegaChart from 'components/widgets/VegaChart';
import Tooltip from 'components/ui/Tooltip';

// Services
import WidgetService from 'services/WidgetService';

// Utils
import vegaThumbnailTheme from 'utils/widgets/vega-theme-thumbnails.json';

export default class EmbedWidget extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      widget: null,
      loading: true
    };

    // WidgetService
    this.widgetService = new WidgetService(this.props.url.query.id, {
      apiURL: process.env.WRI_API_URL
    });
  }

  componentDidMount() {
    this.widgetService.fetchData().then((data) => {
      this.setState({
        loading: false,
        widget: data
      });
    });
  }

  @Autobind
  triggerToggleLoading(loading) {
    this.setState({ loading });
  }

  render() {
    const { widget, loading } = this.state;

    return (
      <div className="c-embed-widget">
        <Head
          title={widget && widget.attributes.name}
          description={widget && widget.attributes.name}
        />
        <Tooltip />
        <Spinner
          isLoading={loading}
          className="-light"
        />
        {widget &&
          <VegaChart
            data={widget.attributes.widgetConfig}
            theme={vegaThumbnailTheme}
            toggleLoading={this.triggerToggleLoading}
          />
        }
      </div>
    );
  }
}
