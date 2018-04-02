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
      layers
    } = routes.query;

    await store.dispatch(actions.fetchLayerGroups({
      layers: ['5868a183-0f99-4c6d-93d1-8ddb7b4f2784', '155968b5-7c59-4065-9e3a-0a81d52d50de']
    }));

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
