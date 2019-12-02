import React, { PureComponent } from 'react';

// actions
import { getPublishedDashboards } from 'modules/dashboards/actions';

// components
import LayoutDashboards from 'layout/dashboards';

class DashboardsPage extends PureComponent {
  static async getInitialProps({ store }) {
    const { getState, dispatch } = store;
    const { dashboards: { published } } = getState();

    if (!published.list.length) await dispatch(getPublishedDashboards());

    return {};
  }


  render() {
    return (<LayoutDashboards />);
  }
}

export default DashboardsPage;
