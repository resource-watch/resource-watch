import React, { PureComponent } from 'react';

// actions
import { getDashboard } from 'modules/dashboards/actions';

// components
import LayoutDashboardDetail from 'layout/app/dashboard-detail';

class DashboardsDetailPage extends PureComponent {
  static async getInitialProps({ store, query }) {
    const { slug } = query;
    await store.dispatch(getDashboard(slug));
    return {};
  }

  render() {
    return (<LayoutDashboardDetail />);
  }
}

export default DashboardsDetailPage;
