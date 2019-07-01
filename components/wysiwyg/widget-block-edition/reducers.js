import * as actions from './actions';

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
    ({ ...state, page: action.payload }),

  [actions.setPages]: (state, action) =>
    ({ ...state, pages: action.payload }),

  [actions.setPageSize]: (state, action) =>
    ({ ...state, pageSize: action.payload }),

  [actions.setTotal]: (state, action) =>
    ({ ...state, total: action.payload }),

  [actions.setSearch]: (state, action) =>
    ({ ...state, search: action.payload })


};
