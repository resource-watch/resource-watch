import * as actions from './dashboard-thumbnail-list-actions';

export default {
  [actions.setDashboardThumbnailList]: (state, action) =>
    ({ ...state, dashboards: action.payload }),

  [actions.setLoading]: (state, action) =>
    ({ ...state, loading: action.payload }),

  [actions.setError]: (state, action) =>
    ({ ...state, error: action.payload }),

  [actions.setSelected]: (state, action) =>
    ({ ...state, selected: action.payload }),

  [actions.setExpanded]: (state, action) =>
    ({ ...state, expanded: action.payload })

};
