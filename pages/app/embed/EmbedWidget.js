import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import { Link } from 'routes';

// Layout
import Head from 'components/app/layout/head';

// Components
import Spinner from 'components/ui/Spinner';
import VegaChart from 'components/widgets/VegaChart';
import Tooltip from 'components/ui/Tooltip';

// Services
import WidgetService from 'services/WidgetService';

// Utils
import ChartTheme from 'utils/widgets/theme';

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
          <div>
            <VegaChart
              data={widget.attributes.widgetConfig}
              theme={ChartTheme()}
              toggleLoading={this.triggerToggleLoading}
            />
            <div className="info">
              <div className="widget-title">
                <h2>
                  <Link
                    route="explore_detail"
                    params={{ id: widget.attributes.dataset }}
                  >
                    <a>{widget.attributes.name}</a>
                  </Link>
                </h2>
              </div>
              <div className="widget-description">
                {widget.attributes.description}
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

EmbedWidget.propTypes = {
  url: PropTypes.object.isRequired
};
