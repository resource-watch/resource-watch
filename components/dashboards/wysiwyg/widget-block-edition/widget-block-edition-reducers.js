import * as actions from './widget-block-edition-actions';

export default {
  [actions.setWidgets]: (state, action) =>
    ({ ...state, widgets: action.payload }),
  [actions.setWidgetsCollections]: (state, action) =>
    ({ ...state, widgetsCollections: action.payload }),
  [actions.setLoading]: (state, action) =>
    ({ ...state, loading: action.payload }),
  [actions.setError]: (state, action) =>
    ({ ...state, error: action.payload })
};
