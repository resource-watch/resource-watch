import * as actions from './similar-datasets-actions';
import initialState from './similar-datasets-initial-state';

export default {
  [actions.getSimilarDatasetsLoading]: state => ({ ...state, loading: true, error: null }),
  [actions.getSimilarDatasetsError]: (state, { payload }) =>
    ({ ...state, loading: true, error: payload }),
  [actions.getSimilarDatasetsSuccess]: state => ({ ...state, loading: false, error: null }),
  [actions.setSimilarDatasets]: (state, { payload }) => ({ ...state, data: payload }),
  [actions.resetSimilarDatasets]: () => initialState
};
