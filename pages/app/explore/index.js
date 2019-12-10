import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Router } from 'routes';

// actions
import { setIsServer } from 'redactions/common';
import * as actions from 'layout/explore/explore-actions';

// components
import Explore from 'layout/explore';

// constants
import { BASEMAPS, LABELS } from 'components/ui/map/constants';

class ExplorePage extends PureComponent {
  static propTypes = {
    explore: PropTypes.object.isRequired,
    resetExplore: PropTypes.func.isRequired,
    setIsServer: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.setIsServer(false);
  }

  static async getInitialProps({ store }) {
    const { dispatch, getState } = store;
    const { routes: { query } } = getState();
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
    } = query;

    // Query
    if (page) dispatch(actions.setDatasetsPage(+page));
    if (search) dispatch(actions.setFiltersSearch(search));
    // adds this extra-condition to enable backward compatibility
    // with deprecated `most-visited` sorting filter
    if (sort && sort !== 'most-visited') dispatch(actions.setSortSelected(sort));
    if (sortDirection) dispatch(actions.setSortDirection(+sortDirection));
    if (topics) dispatch(actions.setFiltersSelected({ key: 'topics', list: JSON.parse(decodeURIComponent(topics)) }));
    if (data_types) dispatch(actions.setFiltersSelected({ key: 'data_types', list: JSON.parse(decodeURIComponent(data_types)) }));
    if (frequencies) dispatch(actions.setFiltersSelected({ key: 'frequencies', list: JSON.parse(decodeURIComponent(frequencies)) }));
    if (time_periods) dispatch(actions.setFiltersSelected({ key: 'time_periods', list: JSON.parse(decodeURIComponent(time_periods)) }));

    // Map
    if (zoom) dispatch(actions.setMapZoom(+zoom));
    if (lat && lng) dispatch(actions.setMapLatLng({ lat: +lat, lng: +lng }));
    if (basemap) dispatch(actions.setMapBasemap(BASEMAPS[basemap]));
    if (labels) dispatch(actions.setMapLabels(LABELS[labels]));
    if (boundaries) dispatch(actions.setMapBoundaries(!!boundaries));

    // Fetch layers
    if (layers) await dispatch(actions.fetchMapLayerGroups(JSON.parse(decodeURIComponent(layers))));

    // Fetch datasets
    await dispatch(actions.fetchDatasets());

    // Fetch tags
    await dispatch(actions.fetchFiltersTags());

    return {};
  }

  componentDidUpdate(prevProps) {
    if (this.shouldUpdateUrl(prevProps)) {
      this.setExploreURL();
    }
  }

  componentWillUnmount() {
    if (process.env.RW_NODE_ENV === 'production') {
      this.props.resetExplore();
    }
  }

  setExploreURL() {
    const { datasets, filters, sort, map } = this.props.explore;

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

  render() {
    return (<Explore />);
  }
}

export default connect(
  state => ({ explore: state.explore }),
  {
    ...actions,
    setIsServer
  }
)(ExplorePage);
