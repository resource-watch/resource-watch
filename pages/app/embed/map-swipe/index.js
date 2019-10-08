import React, { PureComponent } from 'react';

// actions
// import * as actions from 'layout/embed/map-swipe/actions';
import { setEmbed, setIsLoadedExternaly } from 'redactions/common';

// components
import LayoutEmbedMapSwipe from 'layout/embed/map-swipe';

class EmbedMapSwipePage extends PureComponent {
  static async getInitialProps({ store, isServer, req }) {
    const { dispatch, getState } = store;
    const { routes: { query } } = getState();
    const { layers } = query;

    dispatch(setEmbed(true));
    if (isServer) dispatch(setIsLoadedExternaly(!/localhost|(staging\.)?resourcewatch.org/.test(req.headers.referer)));
    if (!isServer) dispatch(setIsLoadedExternaly(!/localhost|(staging\.)?resourcewatch.org/.test(window.location.href)));

    return { layerIds: layers.split(',') };
  }

  render() {
    return (<LayoutEmbedMapSwipe {...this.props} />);
  }
}

export default EmbedMapSwipePage;
