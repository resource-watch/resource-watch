import { connect } from 'react-redux';
import * as actions from './actions';
import * as reducers from './reducers';
import initialState from './default-state';

import BlogLatestPosts from './component';

// Mandatory
export {
  actions, reducers, initialState
};

export default connect(
  ({ latestBlogPosts }) => ({
    posts: latestBlogPosts && latestBlogPosts.posts,
    postsSpotlight: latestBlogPosts && latestBlogPosts.postsSpotlight,
    loading: latestBlogPosts.loading
  }),
  actions
)(BlogLatestPosts);
