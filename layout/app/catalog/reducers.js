import * as actions from './actions';

export default {
  [actions.setDatasets]: (state, { payload }) => ({ ...state, list: payload }),
  [actions.setDatasetsLoading]: (state, { payload }) => ({ ...state, loading: payload }),
  [actions.setDatasetsError]: (state, { payload }) => ({ ...state, error: payload }),
  [actions.setDatasetsSearch]: (state, { payload }) => ({ ...state, search: payload })
};
