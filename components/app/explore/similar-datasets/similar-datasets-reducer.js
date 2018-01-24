import * as actions from './similar-datasets-actions';

export const initialState = {
  data: [], // Similar datasets
  loading: true, // Are we loading the data?
  error: null // An error was produced while loading the data
};

export default {
  [actions.getSimilarDatasetsLoading]: state => ({ ...state, loading: true, error: null }),
  [actions.getSimilarDatasetsError]: (state, { payload }) =>
    ({ ...state, loading: true, error: payload }),
  [actions.getSimilarDatasetsSuccess]: state => ({ ...state, loading: false, error: null }),
  [actions.setSimilarDatasets]: (state, { payload }) => ({ ...state, data: payload }),
  [actions.resetSimilarDatasets]: () => initialState
};
