import React, { PureComponent } from 'react';

// actions
import { getStaticPage } from 'modules/static-pages/actions';

// components
import LayoutDashboards from 'layout/dashboards';

class DashboardsPage extends PureComponent {
  static async getInitialProps({ store }) {
    const { dispatch } = store;

    await dispatch(getStaticPage('topics'));

    return {};
  }

  render() {
    return (<LayoutDashboards />);
  }
}

export default DashboardsPage;
