import * as actions from './actions';

export default {
  [actions.setTopics]: (state, action) =>
    ({ ...state, topics: action.payload }),

  [actions.setLoading]: (state, action) =>
    ({ ...state, loading: action.payload }),

  [actions.setError]: (state, action) =>
    ({ ...state, error: action.payload }),

  [actions.setFilters]: (state, action) =>
    ({ ...state, filters: action.payload })
};
