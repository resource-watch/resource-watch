import { connect } from 'react-redux';

// actions
import { getLatestPosts, getSpotlightPosts } from 'modules/blog/actions';

// component
import BlogFeed from './component';

export default connect(
  state => ({ ...state.blog }),
  {
    getLatestPosts,
    getSpotlightPosts
  }
)(BlogFeed);
