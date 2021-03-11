import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// Widget editor
import Renderer from '@widget-editor/renderer';

// components
import Spinner from 'components/ui/Spinner';
import LayoutEmbed from 'layout/layout/layout-embed';
import ErrorBoundary from 'components/ui/error-boundary';

// services
import { fetchDataset } from 'services/dataset';

// utils
import { isLoadedExternally } from 'utils/embed';

class LayoutEmbedDataset extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      dataset: null,
      loadingDataset: true,
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    const {
      routes: {
        query: {
          id,
        },
      },
    } = this.props;
    fetchDataset(id, { includes: 'widget, metadata' })
      .then((data) => this.setState({
        dataset: data,
        loadingDataset: false,
      }));
  }

  render() {
    const { RWAdapter } = this.props;
    const { dataset, loadingDataset } = this.state;
    const widgets = dataset && dataset.widget;
    const metadataObj = dataset && dataset.metadata[0];
    const datasetName = metadataObj && metadataObj.info
      ? metadataObj.info.name : dataset && dataset.name;
    const datasetDescription = metadataObj && metadataObj
      ? metadataObj.description : dataset && dataset.description;
    const isExternal = isLoadedExternally();
    let widget = null;

    if (widgets) {
      widget = widgets.find((value) => value.default === true);
    }

    if (loadingDataset) {
      return (
        <LayoutEmbed
          title="Loading dataset..."
          description=""
        >
          <div className="c-embed-widget">
            <Spinner
              isLoading
              className="-light"
            />
          </div>
        </LayoutEmbed>
      );
    }

    return (
      <LayoutEmbed
        title={datasetName}
        description={datasetDescription}
      >
        <div className="c-embed-dataset">
          {widget && (
            <ErrorBoundary message="There was an error loading the visualization">
              <div className="widget-content">
                <Renderer
                  adapter={RWAdapter}
                  widgetConfig={widget.widgetConfig}
                />
              </div>
            </ErrorBoundary>
          )}
          <Spinner isLoading={loadingDataset} className="-light -relative" />
          <div className="info">
            <div className="widget-title">
              <h2>
                <Link
                  route="explore"
                  params={{ dataset: dataset.slug }}
                >
                  <a>{datasetName}</a>
                </Link>
              </h2>
            </div>
            <div className="widget-description">
              {datasetDescription}
            </div>
          </div>
          {isExternal && (
            <div className="widget-footer">
              Powered by
              <a href="/" target="_blank" rel="noopener noreferrer">
                <img
                  className="embed-logo"
                  src="/static/images/logo-embed.png"
                  alt="Resource Watch"
                />
              </a>
            </div>
          )}
        </div>
      </LayoutEmbed>
    );
  }
}

LayoutEmbedDataset.propTypes = {
  routes: PropTypes.shape({
    query: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  RWAdapter: PropTypes.func.isRequired,
};

export default LayoutEmbedDataset;
