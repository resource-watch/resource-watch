import { createAction } from 'redux-tools';

export const SET_DATASET = 'SET_DATASET';
export const SET_LOADING = 'SET_LOADING';

export const setDataset = createAction(SET_DATASET);
export const setLoading = createAction(SET_LOADING);

export default {
  setDataset,
  setLoading
};
