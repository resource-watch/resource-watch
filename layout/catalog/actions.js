import 'isomorphic-fetch';
import queryString from 'query-string';
import { createAction, createThunkAction } from 'redux-tools';
import WRISerializer from 'wri-json-api-serializer';

// Actions
export const setDatasets = createAction('CATALOG/setDatasets');
export const setDatasetsLoading = createAction('CATALOG/setDatasetsLoading');
export const setDatasetsError = createAction('CATALOG/setDatasetsError');
export const setDatasetsSearch = createAction('CATALOG/setDatasetsSearch');

// Async actions
export const fetchDatasets = createThunkAction('CATALOG/fetchDatasets', () => (dispatch, getState) => {
  const { catalog, common } = getState();

  dispatch(setDatasetsLoading(true));

  const qParams = queryString.stringify({
    application: process.env.APPLICATIONS,
    language: 'en',
    includes: 'metadata,widget,layer,vocabulary',
    search: catalog.search,
    status: 'saved',
    // sort: '-name',
    published: true,
    'page[size]': 99999
  });

  return fetch(new Request(`${process.env.WRI_API_URL}/dataset/?${qParams}`))
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .then(response => WRISerializer(response, { locale: common.locale }))
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
