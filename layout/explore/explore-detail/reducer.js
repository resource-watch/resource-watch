import {
  SET_LOADING,
  SET_DATASET
} from './actions';

export default (state, { type, payload }) => {
  switch (type) {
    case SET_LOADING:
      return { ...state, loading: payload };
    case SET_DATASET:
      return { ...state, dataset: payload };
    default:
      throw new Error('action not found');
  }
};
