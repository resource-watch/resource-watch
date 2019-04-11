import React, { PureComponent } from 'react';

// actions
import * as actions from 'layout/embed/map-swipe/actions';
import { setEmbed, setIsLoadedExternaly } from 'redactions/common';

// components
import EmbedMapSwipe from 'layout/embed/map-swipe';

class EmbedMapSwipePage extends PureComponent {
  static async getInitialProps({ store, isServer, req }) {
    const { dispatch, getState } = store;
    const { routes: { query } } = getState();
    const {
      zoom,
      lat,
      lng,
      layers
    } = query;

    dispatch(setEmbed(true));
    if (isServer) dispatch(setIsLoadedExternaly(!/localhost|(staging\.)?resourcewatch.org/.test(req.headers.referer)));
    if (!isServer) dispatch(setIsLoadedExternaly(!/localhost|(staging\.)?resourcewatch.org/.test(window.location.href)));

    if (zoom) dispatch(actions.setZoom(+zoom));
    if (lat && lng) dispatch(actions.setLatLng({ lat: +lat, lng: +lng }));

    if (layers && layers.split(',').length === 2) {
      await dispatch(actions.fetchLayerGroups({ layers: layers.split(',') }));
    }

    return {};
  }

  render() {
    return (<EmbedMapSwipe />);
  }
}

export default EmbedMapSwipePage;
