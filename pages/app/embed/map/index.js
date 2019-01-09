import React from 'react';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// actions
import {
  getWidget,
  toggleLayerGroupVisibility,
  checkIfFavorited,
  setIfFavorited
} from 'redactions/widget';
import { setEmbed, setWebshotMode } from 'redactions/common';

// components
import Page from 'layout/page';
import EmbedMapPage from './component';

class EmbedMapPageContainer extends Page {
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
    return (<EmbedMapPage {...this.props} />);
  }
}

export default withRedux(
  initStore,
  state => ({
    widget: state.widget.data,
    loading: state.widget.loading,
    error: state.widget.error,
    layerGroups: state.widget.layerGroups,
    zoom: state.widget.zoom,
    favourited: state.widget.favourite.favourited,
    latLng: state.widget.latLng,
    user: state.user,
    webshot: state.common.webshot
  }),
  {
    getWidget,
    toggleLayerGroupVisibility,
    checkIfFavorited,
    setIfFavorited
  }
)(EmbedMapPageContainer);
