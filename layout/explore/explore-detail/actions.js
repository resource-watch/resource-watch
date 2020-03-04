import { createAction } from 'redux-tools';

export const SET_DATASET = 'SET_DATASET';
export const SET_DATASET_LOADING = 'SET_DATASET_LOADING';
export const SET_TAGS = 'SET_TAGS';
export const SET_TAGS_LOADING = 'SET_TAGS_LOADING';

export const setDataset = createAction(SET_DATASET);
export const setDatasetLoading = createAction(SET_DATASET_LOADING);
export const setTags = createAction(SET_TAGS);
export const setTagsLoading = createAction(SET_TAGS_LOADING);


export default {
  setDataset,
  setDatasetLoading,
  setTags,
  setTagsLoading
};
