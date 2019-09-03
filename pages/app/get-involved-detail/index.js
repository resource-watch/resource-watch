import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// actions
import * as actions from 'layout/get-involved-detail/get-involved-detail-actions';
import { getLatestPosts, getSpotlightPosts } from 'modules/blog/actions';

// components
import GetInvolvedDetail from 'layout/get-involved-detail';

class GetInvolvedDetailPage extends PureComponent {
  static propTypes = { breadCrumb: PropTypes.array.isRequired };

  static async getInitialProps({ store }) {
    const { dispatch, getState } = store;
    const {
      routes: { query: { id, source } },
      blog: {
        latestPosts,
        spotlightPosts,
        latestPostsError,
        spotlightPostsError
      }
    } = getState();

    // fetches posts from blog when there are no posts
    // to display or when an error happened previously
    if (id === 'suggest-a-story' && ((!latestPosts.length && !spotlightPosts.length) ||
    (latestPostsError || spotlightPostsError))) {
      // fetches posts from blog
      await dispatch(getLatestPosts());
      await dispatch(getSpotlightPosts());
    }

    // fetchs static data
    await dispatch(actions.fetchStaticData(id));

    const breadcrumbsItems = source === 'home' ?
      [{ name: 'Home', href: '/' }] :
      [{ name: 'Get involved', href: '/get-involved' }];

    return { breadCrumb: breadcrumbsItems };
  }

  render() {
    const { breadCrumb } = this.props;

    return <GetInvolvedDetail breadCrumb={breadCrumb} />;
  }
}

export default connect(
  state => ({
    getInvolvedDetail: state.getInvolvedDetail,
    user: state.user
  }),
  actions
)(GetInvolvedDetailPage);
