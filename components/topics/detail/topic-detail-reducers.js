import * as actions from './topic-detail-actions';

export default {
  [actions.setTopic]: (state, action) =>
    ({ ...state, topic: action.payload }),

  [actions.setLoading]: (state, action) =>
    ({ ...state, loading: action.payload }),

  [actions.setError]: (state, action) =>
    ({ ...state, error: action.payload })
};
