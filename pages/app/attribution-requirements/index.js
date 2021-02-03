import React, { PureComponent } from 'react';

// actions
import { getStaticPage } from 'modules/static-pages/actions';

// components
import LayoutAttributionRequirements from 'layout/app/attribution-requirements';

class AttributionRequirementsPage extends PureComponent {
  static async getInitialProps({ store }) {
    // fetchs static data for attribution & requirements page
    await store.dispatch(getStaticPage('api-attribution-requirements'));
    return {};
  }

  render() {
    return (<LayoutAttributionRequirements />);
  }
}

export default AttributionRequirementsPage;
