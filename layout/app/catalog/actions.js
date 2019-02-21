import { createAction, createThunkAction } from 'redux-tools';

// services
import { fetchDatasets } from 'services/dataset';

export const setDatasets = createAction('CATALOG__SET-DATASETS');
export const setDatasetsLoading = createAction('CATALOG__SET-DATASETS-LOADING');
export const setDatasetsError = createAction('CATALOG__SET-DATASETS-ERROR');
export const setDatasetsSearch = createAction('CATALOG__SET-DATASETS-SEARCH');

export const getDatasets = createThunkAction('CATALOG__GET-DATASETS', () =>
  (dispatch, getState) => {
    const { catalog: { search } } = getState();
    const params = {
      application: process.env.APPLICATIONS,
      language: 'en',
      includes: ['metadata', 'widget', 'layer', 'vocabulary'].join(','),
      search,
      status: 'saved',
      published: true,
      // TO-DO: set a proper pagination
      'page[size]': 9999
    };

    dispatch(setDatasetsLoading(true));
    dispatch(setDatasetsError(null));

    return fetchDatasets(params)
      .then((datasets) => {
        dispatch(setDatasets(datasets));
        dispatch(setDatasetsLoading(false));
      })
      .catch((err) => {
        dispatch(setDatasetsLoading(false));
        dispatch(setDatasetsError(err));
      });
  });

export default {
  setDatasets,
  setDatasetsLoading,
  setDatasetsError,
  setDatasetsSearch,
  getDatasets
};
