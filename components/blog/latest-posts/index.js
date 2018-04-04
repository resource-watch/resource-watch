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
  state => ({
    posts: state.latestBlogPosts && state.latestBlogPosts.posts
  }),
  actions
)(BlogLatestPosts);
