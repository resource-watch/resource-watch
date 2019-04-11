import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
// actions
import * as actions from 'layout/explore/explore-actions';
import { setEmbed } from 'redactions/common';

// components
import Explore from 'layout/explore/embed';

// constants
import { BASEMAPS, LABELS } from 'components/ui/map/constants';

class ExplorePage extends PureComponent {
  static async getInitialProps({ store }) {
    const { dispatch, getState } = store;
    const { routes: { query } } = getState();
    const {
      zoom,
      lat,
      lng,
      basemap,
      labels,
      boundaries,
      layers
    } = query;

    // Embed
    dispatch(setEmbed(true));

    // Map
    if (zoom) dispatch(actions.setMapZoom(+zoom));
    if (lat && lng) dispatch(actions.setMapLatLng({ lat: +lat, lng: +lng }));
    if (basemap) dispatch(actions.setMapBasemap(BASEMAPS[basemap]));
    if (labels) dispatch(actions.setMapLabels(LABELS[labels]));
    if (boundaries) dispatch(actions.setMapBoundaries(!!boundaries));

    // Fetch layers
    if (layers) await dispatch(actions.fetchMapLayerGroups(JSON.parse(decodeURIComponent(layers))));

    return {};
  }

  render() {
    return (<Explore />);
  }
}

export default connect(
  state => ({
    explore: state.explore,
    routes: state.routes
  }),
  actions
)(ExplorePage);
