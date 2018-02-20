import * as actions from './actions';
import initialState from './initial-state';

export default {
  [actions.setSimilarDatasetsLoading]: (state, { payload }) =>
    ({ ...state, loading: payload, error: null }),
  [actions.setSimilarDatasetsError]: (state, { payload }) =>
    ({ ...state, loading: false, error: payload }),
  [actions.setSimilarDatasets]: (state, { payload }) =>
    ({ ...state, data: payload }),
  [actions.resetSimilarDatasets]: () => initialState
};
