import React, { PureComponent } from 'react';

// actions
import { getStaticPage } from 'modules/static-pages/actions';

// components
import LayoutTermsOfService from 'layout/app/terms-of-service';

class TermsOfServicePage extends PureComponent {
  static async getInitialProps({ store }) {
    const { getState, dispatch } = store;
    const { staticPages } = getState();

    if (!Object.keys(staticPages['terms-of-service']).length) await dispatch(getStaticPage('terms-of-service'));

    return {};
  }

  render() {
    return (<LayoutTermsOfService />);
  }
}

export default TermsOfServicePage;
