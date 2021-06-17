import { createAction } from '@reduxjs/toolkit';
import { createThunkAction } from 'redux-tools';

// services
import {
  fetchPartners,
  fetchPartner,
} from 'services/partners';
import { fetchDatasets } from 'services/dataset';

// actions
export const setPartners = createAction('PARTNERS/SET-PARTNERS');
export const setPartner = createAction('PARTNERS/SET-PARTNER');
export const setDatasets = createAction('PARTNERS/SET-DATASETS-BY-PARTNER');
export const setLoading = createAction('PARTNERS/SET-LOADING');
export const setError = createAction('PARTNERS/SET-ERROR');
export const setFilters = createAction('PARTNERS/SET-FILTERS');

export const getAllPartners = createThunkAction('PARTNERS/GET-ALL-PARTNERS',
  () => (dispatch) => {
    dispatch(setLoading({ key: 'all', value: true }));
    dispatch(setError({ key: 'all', value: null }));

    return fetchPartners()
      .then((partners) => {
        dispatch(setPartners({ key: 'all', value: partners }));
        dispatch(setLoading({ key: 'all', value: false }));
      })
      .catch((err) => {
        dispatch(setError({ key: 'all', value: err.message }));
        dispatch(setLoading({ key: 'all', value: false }));
      });
  });

export const getPartner = createThunkAction('PARTNERS/GET-PARTNER',
  (id) => (dispatch) => {
    if (!id) throw new Error('A partner ID is mandatory to perform this action.');
    dispatch(setLoading({ key: 'detail', value: true }));
    dispatch(setError({ key: 'detail', value: null }));

    return fetchPartner(id)
      .then((partner) => {
        dispatch(setPartner({ key: 'detail', value: partner }));
        dispatch(setLoading({ key: 'detail', value: false }));
      })
      .catch((err) => {
        dispatch(setError({ key: 'detail', value: err.message }));
        dispatch(setLoading({ key: 'detail', value: false }));
      });
  });

export const getDatasetsByPartner = createThunkAction('PARTNERS/GET-PARTNER',
  (datasetIds = []) => (dispatch, getState) => {
    dispatch(setError({ key: 'datasetsByPartner', value: null }));
    const { common: { locale } } = getState();
    const includes = ['widget', 'layer', 'metadata', 'vocabulary'].join(',');

    return fetchDatasets({
      ids: datasetIds.join(','),
      language: locale,
      includes,
      'page[size]': 100,
    })
      .then((datasets) => {
        dispatch(setPartner({ key: 'datasetsByPartner', value: datasets }));
      })
      .catch((err) => { dispatch(setError({ key: 'datasetsByPartner', value: err.message })); });
  });

export default {
  setFilters,
  getAllPartners,
  getPartner,
  getDatasetsByPartner,
};
