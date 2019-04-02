import React, { PureComponent } from 'react';

// actions
import { getStaticPage } from 'modules/static-pages/actions';

// components
import Topics from 'layout/topics';

class TopicsPage extends PureComponent {
  static async getInitialProps({ store }) {
    const { dispatch } = store;

    await dispatch(getStaticPage('dashboards'));

    return {};
  }

  render() {
    return (<Topics />);
  }
}

export default TopicsPage;
