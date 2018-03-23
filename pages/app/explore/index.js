/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';

// Utils
import { BASEMAPS, LABELS } from 'components/ui/map/constants';

// Components
import Page from 'layout/page';

// Next
import { Router } from 'routes';

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
      sort,
      sortDirection,

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
    if (sort) store.dispatch(actions.setSortSelected(sort));
    if (sortDirection) store.dispatch(actions.setSortDirection(+sortDirection));

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

  componentWillUnmount() {
    this.props.resetExplore();
  }

  componentDidUpdate(prevProps) {
    if (this.shouldUpdateUrl(prevProps)) {
      this.setExploreURL();
    }
  }

  shouldUpdateUrl(prevProps) {
    const {
      datasets, filters, sort, map
    } = this.props.explore;

    const {
      datasets: prevDatasets, filters: prevFilters, sort: prevSort, map: prevMap
    } = prevProps.explore;

    const layers = encodeURIComponent(JSON.stringify(map.layerGroups.map(lg => ({
      dataset: lg.dataset,
      opacity: lg.opacity || 1,
      visible: lg.visible,
      layer: lg.layers.find(l => l.active === true).id
    }))));

    const prevLayers = encodeURIComponent(JSON.stringify(prevMap.layerGroups.map(lg => ({
      dataset: lg.dataset,
      opacity: lg.opacity || 1,
      visible: lg.visible,
      layer: lg.layers.find(l => l.active === true).id
    }))));

    return (
      // Map
      map.zoom !== prevMap.zoom ||
      map.latLng.lat !== prevMap.latLng.lat ||
      map.latLng.lng !== prevMap.latLng.lng ||
      map.basemap.id !== prevMap.basemap.id ||
      map.labels.id !== prevMap.labels.id ||
      map.boundaries !== prevMap.boundaries ||
      layers !== prevLayers ||

      // Datasets
      datasets.page !== prevDatasets.page ||
      sort.selected !== prevSort.selected ||
      sort.direction !== prevSort.direction ||
      filters.search !== prevFilters.search
    );
  }

  setExploreURL() {
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
      sortDirection: sort.direction,
      ...filters.search && { search: filters.search }
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

    if (typeof window !== 'undefined') {
      Router.replaceRoute('explore', query, { shallow: true });
    }
  }

  render() {
    return <Explore />;
  }
}

export default withRedux(
  initStore,
  state => ({
    // Store
    explore: state.explore
  }),
  actions
)(ExplorePage);
