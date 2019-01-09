import React from 'react';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// actions
import { getWidget } from 'redactions/widget';
import { setEmbed, setWebshotMode } from 'redactions/common';

// components
import Page from 'layout/page';
import EmbedTextPage from './component';

class EmbedTextPageContainer extends Page {
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
    return (<EmbedTextPage {...this.props} />);
  }
}

export default withRedux(
  initStore,
  state => ({
    widget: state.widget.data,
    loading: state.widget.loading,
    bandDescription: state.widget.bandDescription,
    bandStats: state.widget.bandStats,
    webshot: state.common.webshot
  }),
  { getWidget }
)(EmbedTextPageContainer);
