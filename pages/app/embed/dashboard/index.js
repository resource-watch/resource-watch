import React, { PureComponent } from 'react';

// actions
import { getDashboard } from 'modules/dashboards/actions';
import { setEmbed, setWebshotMode } from 'redactions/common';

// components
import LayoutEmbedDashboard from 'layout/embed/dashboard';

class EmbedDashboardPage extends PureComponent {
  static async getInitialProps({ store, req, isServer }) {
    const { dispatch, getState } = store;
    const { routes: { query: { slug, webshot } } } = getState();

    const hostname = isServer ? req.headers.host : window.location.origin;

    // fetchs dashboard
    await dispatch(getDashboard(slug));

    dispatch(setEmbed(true));
    if (webshot) dispatch(setWebshotMode(true));

    return { hostname };
  }

  render() {
    return (<LayoutEmbedDashboard />);
  }
}

export default EmbedDashboardPage;
