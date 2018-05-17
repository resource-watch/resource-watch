import * as actions from './similar-datasets-actions';
import initialState from './similar-datasets-initial-state';

export default {
  [actions.setSimilarDatasetsLoading]: (state, { payload }) =>
    ({ ...state, loading: payload, error: null }),
  [actions.setSimilarDatasetsError]: (state, { payload }) =>
    ({ ...state, loading: false, error: payload }),
  [actions.setSimilarDatasets]: (state, { payload }) =>
    ({ ...state, data: payload }),
  [actions.resetSimilarDatasets]: () => initialState
};
