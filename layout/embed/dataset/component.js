import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// Widget editor
import Renderer from '@widget-editor/renderer'

// components
import Spinner from 'components/ui/Spinner';
import LayoutEmbed from 'layout/layout/layout-embed';
import ErrorBoundary from 'components/ui/error-boundary';

// services
import { fetchDataset } from 'services/dataset';

// utils
import { isLoadedExternally } from 'utils/embed';

class LayoutEmbedDataset extends PureComponent {
  static propTypes = {
    routes: PropTypes.object.isRequired,
    referer: PropTypes.string.isRequired
  }

  state = {
    dataset: null,
    loadingWidget: true,
    loadingDataset: true
  }

  UNSAFE_componentWillMount() {
    fetchDataset(this.props.routes.query.id, { includes: 'widget, metadata' })
      .then(data =>
        this.setState({
          dataset: data,
          loadingDataset: false
        }));
  }

  triggerToggleLoading = () => { this.setState({ loadingWidget: false }); }

  render() {
    const { referer } = this.props;
    const { dataset, loadingDataset, loadingWidget } = this.state;
    const widgets = dataset && dataset.attributes.widget;
    const metadataObj = dataset && dataset.attributes.metadata[0];
    const datasetName = metadataObj && metadataObj.attributes.info ?
      metadataObj.attributes.info.name : dataset && dataset.attributes.name;
    const datasetDescription = metadataObj && metadataObj.attributes ?
      metadataObj.attributes.description : dataset && dataset.attributes.description;
    const isExternal = isLoadedExternally(referer);
    let widget = null;

    if (widgets) {
      widget = widgets.find(value => value.attributes.default === true);
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
          {widget &&
            <ErrorBoundary message="There was an error loading the visualization">
              <div className="widget-content">
                <Renderer widgetConfig={widget.widgetConfig} />
              </div>
            </ErrorBoundary>
          }
          <Spinner isLoading={loadingWidget} className="-light -relative" />
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

export default LayoutEmbedDataset;
