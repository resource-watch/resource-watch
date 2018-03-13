import 'isomorphic-fetch';
import queryString from 'query-string';
import { Router } from 'routes';
import { createAction, createThunkAction } from 'redux-tools';
import WRISerializer from 'wri-json-api-serializer';

// URL
export const setExploreURL = createThunkAction('EXPLORE/fetchDatasets', () => (dispatch, getState) => {
  const {
    datasets, filters, sort, map
  } = getState().explore;

  Router.replaceRoute('explore', {
    // Map
    zoom: map.zoom,
    lat: map.lat,
    lng: map.lng,
    ...!!map.layers.length && { layers: encodeURIComponent(JSON.stringify(map.layers)) },

    // Datasets
    page: datasets.page,
    sort: sort.selected,
    search: filters.search
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
  });
});

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

  const qParams = queryString.stringify({
    application: process.env.APPLICATIONS,
    language: common.locale,
    includes: 'layer,metadata,vocabulary,widget',
    search: explore.filters.search,
    sort: explore.sort.selected,
    status: 'saved',
    published: true,
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
      const { meta } = response;
      dispatch(setDatasetsTotal(meta['total-items']));
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

// FILTERS
export const setFiltersSearch = createAction('EXPLORE/setFiltersSearch');
export const setFiltersConcepts = createAction('EXPLORE/setFiltersConcepts');

// SIDEBAR
export const setSidebarOpen = createAction('EXPLORE/setSidebarOpen');
