import React from 'react';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// actions
import { getWidget, checkIfFavorited, setIfFavorited } from 'redactions/widget';
import { setEmbed, setWebshotMode } from 'redactions/common';

// components
import Page from 'layout/page';
import EmbedEmbedPage from './component';

class EmbedEmbedPageContainer extends Page {
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
    return (<EmbedEmbedPage {...this.props} />);
  }
}

export default withRedux(
  initStore,
  state => ({
    widget: state.widget.data,
    loading: state.widget.loading,
    error: state.widget.error,
    favourited: state.widget.favourite.favourited,
    user: state.user
  }),
  {
    getWidget,
    checkIfFavorited,
    setIfFavorited
  }
)(EmbedEmbedPageContainer);
