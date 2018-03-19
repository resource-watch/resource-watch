import * as actions from './actions';

export default {
  [actions.setDatasets]: (state, action) =>
    ({
      ...state,
      datasets: action.payload,
      loading: false,
      error: null
    }),

  [actions.setDatasetsLoading]: (state, action) =>
    ({ ...state, loading: action.payload }),

  [actions.setDatasetsError]: (state, action) =>
    ({ ...state, error: action.payload })
};
