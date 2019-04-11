import React, { PureComponent } from 'react';

// actions
import { getStaticPage } from 'modules/static-pages/actions';

// components
import LayoutPolicy from 'layout/app/policy';

class PolicyPage extends PureComponent {
  static async getInitialProps({ store }) {
    await store.dispatch(getStaticPage('privacy-policy'));
    return {};
  }

  render() {
    return (<LayoutPolicy />);
  }
}

export default PolicyPage;
