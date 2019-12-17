import React, { PureComponent } from 'react';

// actions
import { getStaticPage } from 'modules/static-pages/actions';
import { getPublishedDashboards, getFeaturedDashboards } from 'modules/dashboards/actions';

// components
import Topics from 'layout/topics';

class TopicsPage extends PureComponent {
  static async getInitialProps({ store }) {
    const { getState, dispatch } = store;
    const { dashboards: { published, featured } } = getState();
    await dispatch(getStaticPage('topics'));
    if (!published.list.length) await dispatch(getPublishedDashboards());
    if (!featured.list.length) await dispatch(getFeaturedDashboards());

    return {};
  }

  render() {
    return (<Topics />);
  }
}

export default TopicsPage;
