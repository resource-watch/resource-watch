// actions
import { getLatestPosts, getSpotlightPosts } from 'modules/blog/actions';

// components
import LayoutHome from 'layout/app/home';

export default function HomePage() {
  return (<LayoutHome />);
}

HomePage.getInitialProps = async ({ store }) => {
  const { getState, dispatch } = store;
  const {
    blog: {
      latestPosts,
      spotlightPosts,
      latestPostsError,
      spotlightPostsError,
    },
  } = getState();

  // fetches posts from blog when there are no posts
  // to display or when an error happened previously
  if ((!latestPosts.length && !spotlightPosts.length)
    || (latestPostsError || spotlightPostsError)) {
    await dispatch(getLatestPosts());
    await dispatch(getSpotlightPosts());
  }

  return {};
};
