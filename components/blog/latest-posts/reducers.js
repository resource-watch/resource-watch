import * as actions from './actions';

export default {
  [actions.setBlogPostsLatest]: (state, action) =>
    ({ ...state, posts: action.payload }),

  [actions.setBlogPostsSpotlightLatest]: (state, action) =>
    ({ ...state, postsSpotlight: action.payload }),

  [actions.setLoading]: (state, action) =>
    ({ ...state, loading: action.payload }),

  [actions.setError]: (state, action) =>
    ({ ...state, error: action.payload })
};
