import 'isomorphic-fetch';
import queryString from 'query-string';
import WRISerializer from 'wri-json-api-serializer';
import sortBy from 'lodash/sortBy';
import { createAction, createThunkAction } from 'redux-tools';

// Utils
import { TAGS_BLACKLIST } from 'utils/tags';

// RESET
export const resetExplore = createAction('EXPLORE/resetExplore');

// DATASETS
export const setDatasets = createAction('EXPLORE/setDatasetsList');
export const setDatasetsLoading = createAction('EXPLORE/setDatasetsLoading');
export const setDatasetsError = createAction('EXPLORE/setDatasetsError');
export const setDatasetsPage = createAction('EXPLORE/setDatasetsPage');
export const setDatasetsTotal = createAction('EXPLORE/setDatasetsTotal');
export const setDatasetsLimit = createAction('EXPLORE/setDatasetsLimit');
export const setDatasetsMode = createAction('EXPLORE/setDatasetsMode');

export const fetchDatasets = createThunkAction('EXPLORE/fetchDatasets', () => (dispatch, getState) => {
  const { explore, common } = getState();

  const concepts = Object.keys(explore.filters.selected)
    .map(s => explore.filters.selected[s])
    .filter(selected => selected.length);

  const qParams = queryString.stringify({
    application: process.env.APPLICATIONS,
    language: common.locale,
    includes: 'layer,metadata,vocabulary,widget',
    sort: `${explore.sort.direction < 0 ? '-' : ''}${explore.sort.selected}`,
    status: 'saved',
    published: true,
    // Search
    ...explore.filters.search && { search: explore.filters.search },
    // Concepts
    ...concepts.reduce((o, s, i) => ({
      ...o,
      ...s.reduce((o2, s2, j) => ({
        ...o2,
        [`concepts[${i}][${j}]`]: s2
      }), {})
    }), {}),
    // Page
    'page[number]': explore.datasets.page,
    'page[size]': explore.datasets.limit
  });

  dispatch(setDatasetsLoading(true));
  dispatch(setDatasetsError(null));

  return fetch(`${process.env.WRI_API_URL}/dataset?${qParams}`)
    .then((response) => {
      if (response.status >= 400) throw Error(response.statusText);
      return response.json();
    })
    .then((response) => {
      const { meta = {} } = response;
      dispatch(setDatasetsTotal(meta['total-items'] || 0));
      return WRISerializer(response, { locale: common.locale });
    })
    .then((data) => {
      dispatch(setDatasetsLoading(false));
      dispatch(setDatasetsError(null));
      dispatch(setDatasets(data));
    })
    .catch((err) => {
      dispatch(setDatasetsLoading(false));
      dispatch(setDatasetsError(err));
    });
});


// MAP
export const setMapZoom = createAction('EXPLORE/setMapZoom');
export const setMapLatLng = createAction('EXPLORE/setMapLatLng');
export const setMapBasemap = createAction('EXPLORE/setMapBasemap');
export const setMapLabels = createAction('EXPLORE/setMapLabels');
export const setMapBoundaries = createAction('EXPLORE/setMapBoundaries');
export const setMapLocation = createAction('EXPLORE/setMapLocation');

// LAYERS
export const toggleMapLayerGroup = createAction('EXPLORE/toggleMapLayerGroup');
export const setMapLayerGroupVisibility = createAction('EXPLORE/setMapLayerGroupVisibility');
export const setMapLayerGroupOpacity = createAction('EXPLORE/setMapLayerGroupOpacity');
export const setMapLayerGroupActive = createAction('EXPLORE/setMapLayerGroupActive');
export const setMapLayerGroupsOrder = createAction('EXPLORE/setMapLayerGroupsOrder');

// INTERACTION
export const setMapLayerGroupsInteraction = createAction('EXPLORE/setMapLayerGroupsInteraction');
export const setMapLayerGroupsInteractionSelected = createAction('EXPLORE/setMapLayerGroupsInteractionSelected');
export const setMapLayerGroupsInteractionLatLng = createAction('EXPLORE/setMapLayerGroupsInteractionLatLng');
export const resetMapLayerGroupsInteraction = createAction('EXPLORE/resetMapLayerGroupsInteraction');


export const setMapLayerGroups = createAction('EXPLORE/setMapLayerGroups');
export const fetchMapLayerGroups = createThunkAction('EXPLORE/fetchMapLayers', payload => (dispatch, getState) => {
  const { common } = getState();

  const qParams = queryString.stringify({
    application: process.env.APPLICATIONS,
    language: common.locale,
    includes: 'layer',
    ids: payload.map(lg => lg.dataset).join(','),
    'page[size]': 999
  });

  return fetch(`${process.env.WRI_API_URL}/dataset?${qParams}`)
    .then((response) => {
      if (response.status >= 400) throw Error(response.statusText);
      return response.json();
    })
    .then(response => WRISerializer(response, { locale: common.locale }))
    .then((data) => {
      dispatch(setMapLayerGroups({
        datasets: data,
        params: payload
      }));
    })
    .catch((err) => {
      console.error(err);
    });
});


// FILTERS
export const setFiltersOpen = createAction('EXPLORE/setFiltersOpen');
export const setFiltersTab = createAction('EXPLORE/setFiltersTab');
export const setFiltersSearch = createAction('EXPLORE/setFiltersSearch');
export const setFiltersTags = createAction('EXPLORE/setFiltersTags');
export const setFiltersSelected = createAction('EXPLORE/setFiltersSelected');
export const toggleFiltersSelected = createAction('EXPLORE/toggleFiltersSelected');
export const resetFiltersSelected = createAction('EXPLORE/resetFiltersSelected');

export const fetchFiltersTags = createThunkAction('EXPLORE/fetchFiltersTags', () => (dispatch) => {
  const qParams = queryString.stringify({});

  return fetch(`${process.env.WRI_API_URL}/graph/query/list-concepts?${qParams}`)
    .then((response) => {
      if (response.status >= 400) throw Error(response.statusText);
      return response.json();
    })
    .then(({ data }) => {
      dispatch(setFiltersTags(data.filter((tag) => {
        const isBlack = TAGS_BLACKLIST.includes(tag.id);
        const isGeography = (!!tag.labels[1] && tag.labels[1] === 'GEOGRAPHY');
        const hasDatasets = !!tag.numberOfDatasetsTagged;

        return !isBlack && !isGeography && hasDatasets;
      })));
    })
    .catch((err) => {
      console.error(err);
    });
});

// SORT
export const setSortSelected = createAction('EXPLORE/setSortSelected');
export const setSortDirection = createAction('EXPLORE/setSortDirection');
export const setSortIsUserSelected = createAction('EXPLORE/setSortIsUserSelected');
export const resetFiltersSort = createAction('EXPLORE/resetFiltersSort');

// SIDEBAR
export const setSidebarOpen = createAction('EXPLORE/setSidebarOpen');

// TAGS TOOLTIP
export const setTags = createAction('EXPLORE/setTags');
export const setTagsTooltip = createAction('EXPLORE/setTagsTooltip');
export const setTagsLoading = createAction('EXPLORE/setTagsLoading');
export const setTagsError = createAction('EXPLORE/setTagsError');
export const resetTags = createAction('EXPLORE/resetTags');

// Async actions
export const fetchTags = createThunkAction('EXPLORE/fetchTags', tags => (dispatch) => {
  dispatch(setTagsLoading(true));

  return fetch(`${process.env.WRI_API_URL}/graph/query/concepts-inferred?concepts=${tags}&application=${process.env.APPLICATIONS}`)
    .then((response) => {
      if (response.status >= 400) throw Error(response.statusText);
      return response.json();
    })
    .then(({ data }) => {
      dispatch(setTags(sortBy(
        data.filter(tag => !TAGS_BLACKLIST.includes(tag.id) && !!tag.labels[1] && tag.labels[1] !== 'GEOGRAPHY'),
        t => t.label
      )));
      dispatch(setTagsLoading(false));
      dispatch(setTagsError(null));
    })
    .catch((err) => {
      dispatch(setTagsLoading(false));
      dispatch(setTagsError(err.message));
    });
});
