import 'isomorphic-fetch';
import queryString from 'query-string';
import { createAction, createThunkAction } from 'redux-tools';

// Actions
export const setDatasets = createAction('CATALOG/setDatasets');
export const setDatasetsLoading = createAction('TOPIC-DETAIL/setDatasetsLoading');
export const setDatasetsError = createAction('TOPIC-DETAIL/setDatasetsError');

// Async actions
export const getDatasets = createThunkAction('CATALOG/getDatasets', payload => (dispatch) => {
  dispatch(setDatasetsLoading(true));

  const qParams = queryString.stringify({
    application: process.env.APPLICATIONS,
    language: 'en',
    includes: 'metadata',
    search: payload,
    status: 'saved',
    published: true,
    'page[size]': 99999
  });

  return fetch(new Request(`${process.env.WRI_API_URL}/dataset/?${qParams}`))
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .then(({ data }) => {
      console.log('data', data);
      dispatch(setDatasets(data));
    })
    .catch((err) => {
      dispatch(setDatasetsLoading(false));
      dispatch(setDatasetsError(err));
    });
});
