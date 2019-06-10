import * as actions from './actions';

export default {
  [actions.setLatestPosts]: (state, { payload }) =>
    ({ ...state, latestPosts: payload }),
  [actions.setLatestPostsError]: (state, { payload }) =>
    ({ ...state, latestPostsError: payload }),
  [actions.setSpotlightPosts]: (state, { payload }) =>
    ({ ...state, spotlightPosts: payload }),
  [actions.setSpotlightPostsError]: (state, { payload }) =>
    ({ ...state, spotlightPostsError: payload })
};
