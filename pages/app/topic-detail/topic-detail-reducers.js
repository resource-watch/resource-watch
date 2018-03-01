import * as actions from './topic-detail-actions';

export default {
  [actions.setTopic]: (state, action) =>
    ({ ...state, data: action.payload }),

  [actions.setTopicLoading]: (state, action) =>
    ({ ...state, loading: action.payload }),

  [actions.setTopicError]: (state, action) =>
    ({ ...state, error: action.payload })
};
