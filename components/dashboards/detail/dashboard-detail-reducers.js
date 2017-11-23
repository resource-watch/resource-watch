import * as actions from './dashboard-detail-actions';

export default {
  [actions.setDashboard]: (state, action) =>
    ({ ...state, dashboard: action.payload }),

  [actions.setLoading]: (state, action) =>
    ({ ...state, loading: action.payload }),

  [actions.setError]: (state, action) =>
    ({ ...state, error: action.payload })
};
