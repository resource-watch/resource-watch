import React from 'react';
import PropTypes from 'prop-types';

// Next
import { Router } from 'routes';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { setUser } from 'redactions/user';
import { setRouter } from 'redactions/routes';

// Components
import Page from 'components/app/layout/Page';
import EmbedLayout from 'components/app/layout/EmbedLayout';
import SimilarDatasets from 'components/app/explore/similar-datasets/similar-datasets';

class EmbedSimilarDatasets extends Page {
  static async getInitialProps({ asPath, pathname, query, req, store, isServer }) {
    const { user } = isServer ? req : store.getState();
    const url = { asPath, pathname, query };
    const referer = isServer ? req.headers.referer : location.href;
    await store.dispatch(setUser(user));
    store.dispatch(setRouter(url));
    return { user, isServer, url, referer };
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
