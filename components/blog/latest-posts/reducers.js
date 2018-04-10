import * as actions from './actions';

export default {
  [actions.setPosts]: (state, action) =>
    ({ ...state, posts: action.payload }),

  [actions.setPostsLoading]: (state, action) =>
    ({ ...state, postsLoading: action.payload }),

  [actions.setPostsError]: (state, action) =>
    ({ ...state, postsError: action.payload }),

  // SPOTLIGHT
  [actions.setPostsSpotlight]: (state, action) =>
    ({ ...state, postsSpotlight: action.payload }),

  [actions.setPostsSpotlightLoading]: (state, action) =>
    ({ ...state, postsSpotlightLoading: action.payload }),

  [actions.setPostsSpotlightError]: (state, action) =>
    ({ ...state, postsSpotlightError: action.payload })

};
