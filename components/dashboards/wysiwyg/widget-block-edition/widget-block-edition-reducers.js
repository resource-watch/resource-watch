import * as actions from './widget-block-edition-actions';

export default {
  [actions.setWidgets]: (state, action) =>
    ({ ...state, widgets: action.payload }),

  [actions.setLoading]: (state, action) =>
    ({ ...state, loading: action.payload }),

  [actions.setError]: (state, action) =>
    ({ ...state, error: action.payload }),

  [actions.setTab]: (state, action) =>
    ({ ...state, tab: action.payload }),

  [actions.setPage]: (state, action) =>
    ({ ...state, page: action.payload })

};
