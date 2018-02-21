import React from 'react';
import PropTypes from 'prop-types';

// Next
import { Router } from 'routes';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { setEmbed } from 'redactions/common';

// Components
import Page from 'components/layout/page';
import EmbedLayout from 'components/app/layout/EmbedLayout';
import SimilarDatasets from 'components/app/explore/similar-datasets/similar-datasets';

class EmbedSimilarDatasets extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    const { store, isServer, req } = context;

    store.dispatch(setEmbed(true));

    return {
      ...props,
      referer: isServer ? req.headers.referer : location.href
    };
  }

  isLoadedExternally() {
    return !/localhost|staging.resourcewatch.org/.test(this.props.referer);
  }

  render() {
    const { url, loading } = this.props;
    const titleSt = loading ? 'Loading similar datasets...' : '';

    return (
      <EmbedLayout
        title={titleSt}
        description={``}
      >
        <div className="c-embed-similar-datasets">
          <SimilarDatasets
            datasetId={url.query.id}
            onTagSelected={tag => Router.pushRoute('explore', { topics: `["${tag.id}"]` })}
          />
        </div>
      </EmbedLayout>
    );
  }
}

EmbedSimilarDatasets.propTypes = {
  loading: PropTypes.bool.isRequired
};

EmbedSimilarDatasets.defaultProps = {
  loading: true
};

const mapStateToProps = state => ({
  loading: state.similarDatasets.loading
});

export default withRedux(initStore, mapStateToProps, null)(EmbedSimilarDatasets);
