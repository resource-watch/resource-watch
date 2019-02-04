import React from 'react';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// actions
import { getWidget, checkIfFavorited, setIfFavorited } from 'redactions/widget';
import { setEmbed, setWebshotMode } from 'redactions/common';

// components
import Page from 'layout/page';
import EmbedWidgetPage from './component';

class EmbedWidgetPageContainer extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    const { store, isServer, req, query } = context;
    const { webshot, id } = query;
    const { user } = store;
    const referer = isServer ? req.headers.referer : window.location.href;

    store.dispatch(setEmbed(true));
    if (webshot) store.dispatch(setWebshotMode(true));

    await store.dispatch(getWidget(id, { includes: ['metadata'].join(',') }));

    if (!webshot) {
      if (user && user.id) store.dispatch(checkIfFavorited(query.id));
    }

    return {
      ...props,
      referer
    };
  }

  render() {
    return (<EmbedWidgetPage {...this.props} />);
  }
}

export default withRedux(
  initStore,
  state => ({
    widget: state.widget.data,
    loading: state.widget.loading,
    error: state.widget.error,
    bandDescription: state.widget.bandDescription,
    bandStats: state.widget.bandStats,
    favourited: state.widget.favourite.favourited,
    user: state.user,
    webshot: state.common.webshot
  }),
  {
    getWidget,
    checkIfFavorited,
    setIfFavorited
  }
)(EmbedWidgetPageContainer);
