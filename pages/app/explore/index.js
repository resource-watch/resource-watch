/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import { BASEMAPS, LABELS } from 'components/ui/map/constants';

// Components
import Page from 'layout/page';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import * as actions from 'layout/explore/explore-actions';
import Explore from 'layout/explore';

class ExplorePage extends Page {
  static propTypes = {
    explore: PropTypes.object
  };

  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    const { store } = context;
    const { routes } = store.getState();
    const {
      page,
      search,

      zoom,
      lat,
      lng,
      basemap,
      labels,
      boundaries,
      layers
    } = routes.query;

    // Query
    if (page) store.dispatch(actions.setDatasetsPage(+page));
    if (search) store.dispatch(actions.setFiltersSearch(search));

    // Map
    if (zoom) store.dispatch(actions.setMapZoom(+zoom));
    if (lat && lng) store.dispatch(actions.setMapLatLng({ lat: +lat, lng: +lng }));
    if (basemap) store.dispatch(actions.setMapBasemap(BASEMAPS[basemap]));
    if (labels) store.dispatch(actions.setMapLabels(LABELS[labels]));
    if (boundaries) store.dispatch(actions.setMapBoundaries(!!boundaries));

    // Fetch layers
    if (layers) await store.dispatch(actions.fetchMapLayerGroups(JSON.parse(decodeURIComponent(layers))));

    // Fetch datasets
    await store.dispatch(actions.fetchDatasets());

    return { ...props };
  }

  componentDidUpdate() {
    // URL
    const {
      datasets, filters, sort, map
    } = this.props.explore;

    const query = {
      // Map
      zoom: map.zoom,
      lat: map.latLng.lat,
      lng: map.latLng.lng,
      basemap: map.basemap.id,
      labels: map.labels.id,
      ...!!map.boundaries && { boundaries: map.boundaries },
      ...!!map.layerGroups.length &&
        {
          layers: encodeURIComponent(JSON.stringify(map.layerGroups.map(lg => ({
            dataset: lg.dataset,
            opacity: lg.opacity || 1,
            visible: lg.visible,
            layer: lg.layers.find(l => l.active === true).id
          }))))
        },

      // Datasets
      page: datasets.page,
      sort: sort.selected,
      ...filters.search &&
        { search: filters.search }
      //   if (topics) {
      //     if (topics.length > 0) {
      //       query.topics = JSON.stringify(topics);
      //     } else {
      //       delete query.topics;
      //     }
      //   }
      //
      //   if (dataTypes) {
      //     if (dataTypes.length > 0) {
      //       query.dataTypes = JSON.stringify(dataTypes);
      //     } else {
      //       delete query.dataType;
      //     }
      //   }
      //
      //   if (geographies) {
      //     if (geographies.length > 0) {
      //       query.geographies = JSON.stringify(geographies);
      //     } else {
      //       delete query.geographies;
      //     }
      //   }
    };

    window.history.replaceState({}, `/data/explore?${queryString.stringify(query)}`, `/data/explore?${queryString.stringify(query)}`);
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
