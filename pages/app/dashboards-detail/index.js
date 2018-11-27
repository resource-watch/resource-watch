import React from 'react';
import withRedux from 'next-redux-wrapper';

// actions
import { initStore } from 'store';
import { fetchDashboard } from 'components/dashboards/detail/dashboard-detail-actions';

// components
import Page from 'layout/page';
import DashboardDetail from './component';

// selectors
import { getDatasetIds } from './selectors';

class DashboardsDetail extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);

    await context.store.dispatch(fetchDashboard({ id: props.url.query.slug }));

    return { ...props };
  }

  render() {
    return (<DashboardDetail {...this.props} />);
  }
}

export default withRedux(
  initStore,
  state => ({
    dashboardDetail: state.dashboardDetail.dashboard,
    datasetIds: getDatasetIds(state)
  }),
  null
)(DashboardsDetail);
