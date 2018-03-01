import * as actions from './topic-thumbnail-list-actions';

export default {
  [actions.setTopicThumbnailList]: (state, action) =>
    ({ ...state, topics: action.payload }),

  [actions.setLoading]: (state, action) =>
    ({ ...state, loading: action.payload }),

  [actions.setError]: (state, action) =>
    ({ ...state, error: action.payload }),

  [actions.setSelected]: (state, action) =>
    ({ ...state, selected: action.payload }),

  [actions.setExpanded]: (state, action) =>
    ({ ...state, expanded: action.payload }),

  [actions.setTotal]: (state, action) =>
    ({ ...state, total: action.payload }),

  [actions.setPagination]: (state, action) =>
    ({ ...state, pagination: action.payload }),

  [actions.setAdd]: (state, action) =>
    ({ ...state, add: action.payload })

};
