import * as actions from './actions';

export default {
  [actions.setDatasets]: (state, action) =>
    ({ ...state, list: action.payload }),

  [actions.setDatasetsLoading]: (state, action) =>
    ({ ...state, loading: action.payload }),

  [actions.setDatasetsError]: (state, action) =>
    ({ ...state, error: action.payload }),

  [actions.setDatasetsSearch]: (state, action) =>
    ({ ...state, search: action.payload })

};
