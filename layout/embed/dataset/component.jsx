import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

// Widget editor
import Renderer from '@widget-editor/renderer';

// components
import LayoutEmbed from 'layout/layout/layout-embed';
import ErrorBoundary from 'components/ui/error-boundary';

// utils
import { isLoadedExternally } from 'utils/embed';

// constants
import { WIDGET_EDITOR_MAPBOX_PROPS } from 'constants/widget-editor';

class LayoutEmbedDataset extends PureComponent {
  render() {
    const { RWAdapter, dataset } = this.props;
    const widgets = dataset && dataset.widget;
    const metadataObj = dataset && dataset.metadata[0];
    const datasetName =
      metadataObj && metadataObj.info ? metadataObj.info.name : dataset && dataset.name;
    const datasetDescription =
      metadataObj && metadataObj ? metadataObj.description : dataset && dataset.description;
    const isExternal = isLoadedExternally();
    let widget = null;

    if (widgets) {
      widget = widgets.find((value) => value.default === true);
    }

    return (
      <LayoutEmbed title={datasetName} description={datasetDescription}>
        <div className="c-embed-dataset">
          {widget && (
            <ErrorBoundary message="There was an error loading the visualization">
              <div className="widget-content">
                <Renderer
                  adapter={RWAdapter}
                  widgetConfig={widget.widgetConfig}
                  map={WIDGET_EDITOR_MAPBOX_PROPS}
                />
              </div>
            </ErrorBoundary>
          )}
          <div className="info">
            <div className="widget-title">
              <h2>
                <Link href={`/data/explore/${dataset.slug}`}>
                  <a>{datasetName}</a>
                </Link>
              </h2>
            </div>
            <div className="widget-description">{datasetDescription}</div>
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
  dataset: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    description: PropTypes.string,
    widget: PropTypes.shape({}),
    metadata: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  RWAdapter: PropTypes.func.isRequired,
};

export default LayoutEmbedDataset;
