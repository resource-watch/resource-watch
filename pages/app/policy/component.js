import React, { PureComponent } from 'react';

// actions
import { getStaticData } from 'redactions/static_pages';

// components
import LayoutPolicy from 'layout/app/policy';

class PolicyPage extends PureComponent {
  static async getInitialProps({ store }) {
    // fetchs static data for policy page
    await store.dispatch(getStaticData('privacy-policy'));
    return {};
  }

  render() {
    return (<LayoutPolicy />);
  }
}

export default PolicyPage;
