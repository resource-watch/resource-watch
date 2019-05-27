import React, { PureComponent } from 'react';

// actions
import { getLatestPosts, getSpotlightPosts } from 'modules/blog/actions';

// components
import LayoutHome from 'layout/app/home';

class HomePage extends PureComponent {
  static async getInitialProps({ store }) {
    const { getState, dispatch } = store;
    const { blog: { latestPosts, spotlightPosts } } = getState();


    // fetches posts from blog
    if (!latestPosts.length && !spotlightPosts.length) {
      await dispatch(getLatestPosts());
      await dispatch(getSpotlightPosts());
    }

    return {};
  }

  render() {
    return (<LayoutHome />);
  }
}

export default HomePage;
