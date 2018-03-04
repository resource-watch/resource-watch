import * as actions from './actions';

export default {
  [actions.setTopicThumbnailList]: (state, action) =>
    ({ ...state, topics: action.payload }),

  [actions.setLoading]: (state, action) =>
    ({ ...state, loading: action.payload }),

  [actions.setError]: (state, action) =>
    ({ ...state, error: action.payload }),

  [actions.setSelected]: (state, action) =>
    ({ ...state, selected: action.payload })
};
