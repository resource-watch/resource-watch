import {
  SET_DATASET_LOADING,
  SET_DATASET,
  SET_TAGS,
  SET_TAGS_LOADING
} from './actions';

export default (state, { type, payload }) => {
  switch (type) {
    case SET_DATASET_LOADING:
      return { ...state, datasetLoading: payload };
    case SET_DATASET:
      return { ...state, dataset: payload };
    case SET_TAGS_LOADING:
      return { ...state, tagsLoading: payload };
    case SET_TAGS:
      return { ...state, tags: payload };
    default:
      throw new Error('action not found');
  }
};
