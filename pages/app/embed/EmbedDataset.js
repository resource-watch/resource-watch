import React from 'react';
import { Autobind } from 'es-decorators';
import { Link } from 'routes';

// Layout
import Head from 'components/app/layout/head';

// Components
import Spinner from 'components/ui/Spinner';
import VegaChart from 'components/widgets/VegaChart';
import Tooltip from 'components/ui/Tooltip';

// Services
import DatasetService from 'services/DatasetService';

// Utils
import vegaThumbnailTheme from 'utils/widgets/vega-theme-thumbnails.json';

export default class EmbedDataset extends React.Component {

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
              theme={vegaThumbnailTheme}
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
