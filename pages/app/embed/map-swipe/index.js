/* eslint max-len: 0 */
import React from 'react';

// Components
import Page from 'layout/page';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

import * as actions from 'layout/embed/map-swipe/actions';
import { setEmbed, setIsLoadedExternaly } from 'redactions/common';

import EmbedMapSwipe from 'layout/embed/map-swipe';

class EmbedMapSwipePage extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    const { store, isServer, req } = context;

    store.dispatch(setEmbed(true));
    if (isServer) store.dispatch(setIsLoadedExternaly(!/localhost|staging.resourcewatch.org/.test(req.headers.referer)));
    if (!isServer) store.dispatch(setIsLoadedExternaly(!/localhost|staging.resourcewatch.org/.test(window.location.href)));

    // Fetch layers
    const { routes } = store.getState();
    const {
      zoom,
      lat,
      lng,
      layers
    } = routes.query;

    if (zoom) store.dispatch(actions.setZoom(+zoom));
    if (lat && lng) store.dispatch(actions.setLatLng({ lat: +lat, lng: +lng }));

    if (layers && layers.split(',').length === 2) {
      await store.dispatch(actions.fetchLayerGroups({
        layers: layers.split(',')
      }));
    }

    return {
      ...props
    };
  }

  render() {
    return <EmbedMapSwipe />;
  }
}

export default withRedux(
  initStore,
  null,
  actions
)(EmbedMapSwipePage);
