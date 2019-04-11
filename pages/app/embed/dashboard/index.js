import React, { PureComponent } from 'react';

// actions
import { getDashboard } from 'modules/dashboards/actions';
import { setEmbed, setWebshotMode } from 'redactions/common';

// components
import LayoutEmbedDashboard from 'layout/embed/dashboard';

class EmbedDashboardPage extends PureComponent {
  static async getInitialProps({ store }) {
    const { dispatch, getState } = store;
    const { routes: { query: { slug, webshot } } } = getState();

    // fetchs dashboard
    await dispatch(getDashboard(slug));

    dispatch(setEmbed(true));
    if (webshot) dispatch(setWebshotMode(true));

    return {};
  }

  render() {
    return (<LayoutEmbedDashboard />);
  }
}

export default EmbedDashboardPage;
