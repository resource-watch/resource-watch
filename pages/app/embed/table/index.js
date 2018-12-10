import React from 'react';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// actions
import { setEmbed, setWebshotMode } from 'redactions/common';

// components
import Page from 'layout/page';
import EmbedTablePage from './component';

class EmbedTablePageContainer extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    const { store, isServer, req, query } = context;
    const { webshot } = query;
    const referer = isServer ? req.headers.referer : window.location.href;

    store.dispatch(setEmbed(true));
    if (webshot) store.dispatch(setWebshotMode(true));

    return {
      ...props,
      referer
    };
  }

  render() {
    return (<EmbedTablePage {...this.props} />);
  }
}

export default withRedux(initStore, null, null)(EmbedTablePageContainer);
