import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

// actions
import { getDashboard } from 'modules/dashboards/actions';
import { setEmbed, setWebshotMode } from 'redactions/common';

// components
import EmbedDashboardPage from './component';

class EmbedDashboardPageContainer extends PureComponent {
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
    return (<EmbedDashboardPage {...this.props} />);
  }
}


export default connect(
  state => ({ dashboard: state.dashboards.detail.data }),
  null
)(EmbedDashboardPageContainer);
