import React from 'react';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// actions
import { fetchDashboard } from 'components/dashboards/detail/dashboard-detail-actions';
import { setEmbed, setWebshotMode } from 'redactions/common';

// components
import Page from 'layout/page';
import EmbedDashboardPage from './component';

class EmbedDashboardPageContainer extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    const { store, query } = context;
    const { webshot } = query;

    // fetchs dashboard
    await store.dispatch(fetchDashboard({ id: query.slug }));

    store.dispatch(setEmbed(true));
    if (webshot) store.dispatch(setWebshotMode(true));

    return { ...props };
  }

  render() {
    return (<EmbedDashboardPage {...this.props} />);
  }
}


export default withRedux(
  initStore,
  state => ({ dashboard: state.dashboardDetail }),
  null
)(EmbedDashboardPageContainer);
