// actions
import { getLatestPosts, getSpotlightPosts } from 'modules/blog/actions';

// hoc
import {
  withRedux,
  withUserServerSide,
} from 'hoc/auth';

// components
import LayoutHome from 'layout/app/home';

export default function HomePage() {
  return (<LayoutHome />);
}

export const getServerSideProps = withRedux(withUserServerSide(async ({ store }) => {
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

  return ({
    props: ({}),
  });
}));
