import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
// actions
import * as actions from 'layout/explore/actions';
import { setEmbed } from 'redactions/common';

// components
import Explore from 'layout/explore/embed';

<<<<<<< HEAD
class EmbedExplorePage extends PureComponent {
=======
// constants
import { BASEMAPS, LABELS } from 'components/map/constants';

class ExplorePage extends PureComponent {
>>>>>>> [Mapbox]: Adds zoom controls, share control, search control
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

<<<<<<< HEAD
    // sets map params from URL
    dispatch(actions.setViewport({
      ...zoom && { zoom: +zoom },
      ...(lat && lng) && {
        latitude: +lat,
        longitude: +lng
      }
    }));
    if (basemap) dispatch(actions.setBasemap(basemap));
    if (labels) dispatch(actions.setLabels(labels));
=======
    // Map
    if (zoom) dispatch(actions.setMapZoom(+zoom));
    if (lat && lng) dispatch(actions.setMapLatLng({ lat: +lat, lng: +lng }));
    if (basemap) dispatch(actions.setBasemap(BASEMAPS[basemap]));
    if (labels) dispatch(actions.setLabels(LABELS[labels]));
>>>>>>> [Mapbox]: Adds zoom controls, share control, search control
    if (boundaries) dispatch(actions.setBoundaries(!!boundaries));

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
)(EmbedExplorePage);
