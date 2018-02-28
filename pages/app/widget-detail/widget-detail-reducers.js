import * as actions from './widget-detail-actions';

export default {
  [actions.setWidget]: (state, action) =>
    ({ ...state, data: action.payload }),

  [actions.setWidgetLoading]: (state, action) =>
    ({ ...state, loading: action.payload }),

  [actions.setWidgetError]: (state, action) =>
    ({ ...state, error: action.payload })
};
