import React, { PureComponent } from 'react';

// actions
import { getStaticPage } from 'modules/static-pages/actions';
import { getHighlightedDashboards, getFeaturedDashboards } from 'modules/dashboards/actions';

// components
import LayoutDashboards from 'layout/app/dashboards';

class DashboardsPage extends PureComponent {
  static async getInitialProps({ store }) {
    const { getState, dispatch } = store;
    const { dashboards: { highlighted, featured } } = getState();
    await dispatch(getStaticPage('topics'));
    if (!highlighted.list.length) await dispatch(getHighlightedDashboards());
    if (!featured.list.length) await dispatch(getFeaturedDashboards());

    return {};
  }

  render() {
    return (<LayoutDashboards />);
  }
}

export default DashboardsPage;

