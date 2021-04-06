import React, { PureComponent } from 'react';

// actions
import { getLatestPosts, getSpotlightPosts } from 'modules/blog/actions';
import { getFeaturedDashboards } from 'modules/dashboards/actions';

// components
import LayoutHome from 'layout/app/home';

class HomePage extends PureComponent {
  static async getInitialProps({ store }) {
    const { getState, dispatch } = store;
    const {
      blog: {
        latestPosts,
        spotlightPosts,
        latestPostsError,
        spotlightPostsError,
      },
      dashboards: { featured },
    } = getState();

    // fetches posts from blog when there are no posts
    // to display or when an error happened previously
    if ((!latestPosts.length && !spotlightPosts.length)
      || (latestPostsError || spotlightPostsError)) {
      await dispatch(getLatestPosts());
      await dispatch(getSpotlightPosts());
    }

    if (!featured.list.length) await dispatch(getFeaturedDashboards());

    return {};
  }

  render() {
    return (<LayoutHome />);
  }
}

export default HomePage;
