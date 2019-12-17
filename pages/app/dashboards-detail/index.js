import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';


// actions
import { getDashboard } from 'modules/dashboards/actions';
import { getTopic, setSelected } from 'modules/topics/actions';

// components
import LayoutDashboardDetail from 'layout/app/dashboard-detail';
import TopicDetailLayout from 'layout/app/topics-detail';
import Error from 'pages/_error';

class DashboardsDetailPage extends PureComponent {
  static propTypes = {
    topicsDetail: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
    setSelected: PropTypes.func.isRequired
  };

  static async getInitialProps({ store }) {
    const { dispatch, getState } = store;
    const { routes: { query: { slug, topic } } } = getState();

    if (topic) {
      await dispatch(getTopic(slug));
      // sets current topic in thumbnail list
      dispatch(setSelected(slug));
    } else {
      await store.dispatch(getDashboard(slug));
    }

    return { };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.routes.query.slug !== nextProps.routes.query.slug) {
      window.scrollTo(0, 0);
    }
  }

  componentWillUnmount() {
    this.props.setSelected(null);
  }

  render() {
    const { routes: { query: { topic } } } = this.props;

    if (topic) {
      const { topicsDetail } = this.props;
      if (isEmpty(topicsDetail)) return <Error statusCode={404} />;
      return <TopicDetailLayout />;
    }

    return <LayoutDashboardDetail />;
  }
}

export default connect(
  state => ({
    topicsDetail: state.topics.detail.data,
    routes: state.routes
  }),
  { setSelected }
)(DashboardsDetailPage);
