import PropTypes from 'prop-types';

// actions
import * as actions from 'layout/get-involved-detail/get-involved-detail-actions';
import { getLatestPosts, getSpotlightPosts } from 'modules/blog/actions';

// hoc
import {
  withRedux,
  withUserServerSide,
} from 'hoc/auth';

// components
import GetInvolvedDetail from 'layout/get-involved-detail';

export default function GetInvolvedDetailPage({
  breadCrumb,
}) {
  return <GetInvolvedDetail breadCrumb={breadCrumb} />;
}

export const getServerSideProps = withRedux(withUserServerSide(async ({ store, query }) => {
  const { dispatch, getState } = store;
  const {
    blog: {
      latestPosts,
      spotlightPosts,
      latestPostsError,
      spotlightPostsError,
    },
  } = getState();
  const {
    id,
    source,
  } = query;

  // fetches posts from blog when there are no posts
  // to display or when an error happened previously
  if (id === 'suggest-a-story' && ((!latestPosts.length && !spotlightPosts.length)
  || (latestPostsError || spotlightPostsError))) {
    // fetches posts from blog
    await dispatch(getLatestPosts());
    await dispatch(getSpotlightPosts());
  }

  // fetchs static data
  await dispatch(actions.fetchStaticData(id));

  const breadcrumbsItems = source === 'home'
    ? [{ name: 'Home', route: '/' }]
    : [{ name: 'Get involved', route: '/get-involved' }];

  return ({
    props: ({
      breadCrumb: breadcrumbsItems,
    }),
  });
}));
GetInvolvedDetailPage.propTypes = {
  breadCrumb: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
