import React from 'react';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// actions
import { setEmbed, setWebshotMode } from 'redactions/common';

// components
import Page from 'layout/page';
import EmbedSimilarDatasetsPage from './component';

class EmbedSimilarDatasetsPageContainer extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    const { store, query } = context;
    const { webshot } = query;

    store.dispatch(setEmbed(true));
    if (webshot) store.dispatch(setWebshotMode(true));

    return { ...props };
  }

  render() {
    return (<EmbedSimilarDatasetsPage {...this.props} />);
  }
}

export default withRedux(
  initStore,
  state => ({ loading: state.similarDatasets.loading }),
  null
)(EmbedSimilarDatasetsPageContainer);
