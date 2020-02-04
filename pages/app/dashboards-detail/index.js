import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// actions
import { getDashboard } from 'modules/dashboards/actions';

// components
import LayoutDashboardDetail from 'layout/app/dashboard-detail';

class DashboardsDetailPage extends PureComponent {
  static propTypes = { routes: PropTypes.object.isRequired };

  static async getInitialProps({ store }) {
    const { dispatch, getState } = store;
    const { routes: { query: { slug } } } = getState();

    await dispatch(getDashboard(slug));

    return { };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.routes.query.slug !== nextProps.routes.query.slug) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return <LayoutDashboardDetail />;
  }
}

export default connect(
  state => ({ routes: state.routes }),
  null
)(DashboardsDetailPage);
