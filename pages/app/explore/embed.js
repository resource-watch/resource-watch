/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';

import { BASEMAPS, LABELS } from 'components/ui/map/constants';

// Components
import Page from 'layout/page';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import * as actions from 'layout/explore/explore-actions';
import Explore from 'layout/explore/embed';

class ExplorePage extends Page {
  static propTypes = {
    explore: PropTypes.object
  };

  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    const { store } = context;
    const { routes } = store.getState();
    const {
      zoom,
      lat,
      lng,
      basemap,
      labels,
      boundaries,
      layers
    } = routes.query;

    // Map
    if (zoom) store.dispatch(actions.setMapZoom(+zoom));
    if (lat && lng) store.dispatch(actions.setMapLatLng({ lat: +lat, lng: +lng }));
    if (basemap) store.dispatch(actions.setMapBasemap(BASEMAPS[basemap]));
    if (labels) store.dispatch(actions.setMapLabels(LABELS[labels]));
    if (boundaries) store.dispatch(actions.setMapBoundaries(!!boundaries));

    // Fetch layers
    if (layers) await store.dispatch(actions.fetchMapLayerGroups(JSON.parse(decodeURIComponent(layers))));

    return { ...props };
  }

  render() {
    return <Explore />;
  }
}

export default withRedux(
  initStore,
  state => ({
    // Store
    explore: state.explore,
    routes: state.routes
  }),
  actions
)(ExplorePage);
