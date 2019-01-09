import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// components
import LayoutEmbed from 'layout/layout/layout-embed';
import SimilarDatasets from 'components/datasets/similar-datasets/similar-datasets';

class EmbedSimilarDatasetsPage extends PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    url: PropTypes.object.isRequired
  };

  render() {
    const { url, loading } = this.props;
    const titleSt = loading ? 'Loading similar datasets...' : '';

    return (
      <LayoutEmbed
        title={titleSt}
        description=""
      >
        <div className="c-embed-similar-datasets">
          <SimilarDatasets
            datasetIds={url.query.id}
            onTagSelected={tag => Router.pushRoute('explore', { topics: `["${tag.id}"]` })}
          />
        </div>
      </LayoutEmbed>
    );
  }
}

export default EmbedSimilarDatasetsPage;
