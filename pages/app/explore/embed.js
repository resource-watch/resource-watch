import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
// actions
import * as actions from 'layout/explore/actions';
import { setEmbed } from 'redactions/common';

// components
import Explore from 'layout/explore/embed';

class EmbedExplorePage extends PureComponent {
  static async getInitialProps({ store }) {
    const { dispatch, getState } = store;
    const { routes: { query } } = getState();
    const {
      zoom,
      lat,
      lng,
      pitch,
      bearing,
      basemap,
      labels,
      boundaries,
      layers
    } = query;

    // Embed
    dispatch(setEmbed(true));

    // sets map params from URL
    dispatch(actions.setViewport({
      ...zoom && { zoom: +zoom },
      ...(lat && lng) && {
        latitude: +lat,
        longitude: +lng
      },
      ...pitch && { pitch: +pitch },
      ...bearing && { bearing: +bearing }
    }));
    if (basemap) dispatch(actions.setBasemap(basemap));
    if (labels) dispatch(actions.setLabels(labels));
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
