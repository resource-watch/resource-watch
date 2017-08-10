import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import { Link } from 'routes';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Layout
import Head from 'components/app/layout/head';

// Components
import Spinner from 'components/ui/Spinner';
import VegaChart from 'components/widgets/VegaChart';
import Tooltip from 'components/ui/Tooltip';

// Services
import DatasetService from 'services/DatasetService';

// Utils
import ChartTheme from 'utils/widgets/theme';

class EmbedDataset extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dataset: null,
      loading: true
    };

    // DatasetService
    this.datasetService = new DatasetService(this.props.url.query.id, {
      apiURL: process.env.WRI_API_URL
    });
  }

  componentDidMount() {
    this.datasetService.fetchData('widget, metadata').then((data) => {
      this.setState({
        dataset: data,
        loading: false
      });
    });
  }

  @Autobind
  triggerToggleLoading(loading) {
    this.setState({ loading });
  }

  render() {
    const { dataset, loading } = this.state;
    const widgets = dataset && dataset.attributes.widget;
    let widget = null;

    if (widgets) {
      widget = widgets.find(value => value.attributes.default === true);
    }

    return (
      <div className="c-embed-widget">
        <Head
          title={widget && dataset.attributes.name}
          description={widget && dataset.attributes.name}
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
                    params={{ id: dataset.id }}
                  >
                    <a>{dataset.attributes.name}</a>
                  </Link>
                </h2>
              </div>
              <div className="widget-description">
                {dataset.attributes.metadata[0].attributes.description}
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

EmbedDataset.propTypes = {
  url: PropTypes.object.isRequired
};

export default withRedux(null, null)(EmbedDataset);
