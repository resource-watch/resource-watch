import React, { PureComponent } from 'react';

// actions
import {
  fetchBlogPostsLatest,
  fetchBlogPostsSpotlightLatest
} from 'components/blog/latest-posts/actions';

// components
import LayoutHome from 'layout/app/home';

class HomePage extends PureComponent {
  static async getInitialProps({ store, req, isServer }) {
    // fetchs latest posts from blog
    await store.dispatch(fetchBlogPostsLatest());
    await store.dispatch(fetchBlogPostsSpotlightLatest());

    const hostname = isServer ? req.headers.host : window.location.origin;

    return { hostname };
  }

  render() {
    return (
      <LayoutHome />
    );
  }
}

export default HomePage;
