import * as actions from './get-involved-actions';

export default {
  [actions.setStaticData]: (state, action) =>
    ({ ...state, staticData: action.payload }),

  [actions.setStaticDataLoading]: (state, action) =>
    ({ ...state, loading: action.payload }),

  [actions.setStaticDataError]: (state, action) =>
    ({ ...state, error: action.payload })
};
