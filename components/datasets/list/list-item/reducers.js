import * as actions from './actions';
import initialState from './initial-state';

export default {
  [actions.setTagsTooltip]: (state, { payload }) =>
    ({ ...state, tooltip: payload }),
  [actions.setTags]: (state, { payload }) =>
    ({ ...state, tags: payload }),
  [actions.setTagsLoading]: (state, { payload }) =>
    ({ ...state, loading: payload, error: null }),
  [actions.setTagsError]: (state, { payload }) =>
    ({ ...state, loading: false, error: payload }),
  [actions.resetTags]: () => initialState
};
