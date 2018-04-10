/* eslint max-len: 0 */
/* eslint-disable camelcase */
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
    explore: PropTypes.object,
    resetExplore: PropTypes.func
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
      topics,
      data_types,
      frequencies,
      time_periods,

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
    if (topics) store.dispatch(actions.setFiltersSelected({ key: 'topics', list: JSON.parse(decodeURIComponent(topics)) }));
    if (data_types) store.dispatch(actions.setFiltersSelected({ key: 'data_types', list: JSON.parse(decodeURIComponent(data_types)) }));
    if (frequencies) store.dispatch(actions.setFiltersSelected({ key: 'frequencies', list: JSON.parse(decodeURIComponent(frequencies)) }));
    if (time_periods) store.dispatch(actions.setFiltersSelected({ key: 'time_periods', list: JSON.parse(decodeURIComponent(time_periods)) }));

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

    // Fetch tags
    await store.dispatch(actions.fetchFiltersTags());

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
      filters.search !== prevFilters.search ||
      filters.selected.topics.length !== prevFilters.selected.topics.length ||
      filters.selected.data_types.length !== prevFilters.selected.data_types.length ||
      filters.selected.frequencies.length !== prevFilters.selected.frequencies.length ||
      filters.selected.time_periods.length !== prevFilters.selected.time_periods.length
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
      ...filters.search && { search: filters.search },
      ...!!filters.selected.topics.length && { topics: encodeURIComponent(JSON.stringify(filters.selected.topics)) },
      ...!!filters.selected.data_types.length && { data_types: encodeURIComponent(JSON.stringify(filters.selected.data_types)) },
      ...!!filters.selected.frequencies.length && { frequencies: encodeURIComponent(JSON.stringify(filters.selected.frequencies)) },
      ...!!filters.selected.time_periods.length && { time_periods: encodeURIComponent(JSON.stringify(filters.selected.time_periods)) }
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
