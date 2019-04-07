import React, { PureComponent } from 'react';

// actions
import {
  fetchBlogPostsLatest,
  fetchBlogPostsSpotlightLatest
} from 'components/blog/latest-posts/actions';

// components
import LayoutHome from 'layout/app/home';

class HomePage extends PureComponent {
  static async getInitialProps({ store }) {
    // fetchs latest posts from blog
    await store.dispatch(fetchBlogPostsLatest());
    await store.dispatch(fetchBlogPostsSpotlightLatest());

    return {};
  }

  render() {
    return (
      <LayoutHome />
    );
  }
}

export default HomePage;
