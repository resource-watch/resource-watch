import React, { PureComponent } from 'react';

// actions
import { getStaticData } from 'redactions/static_pages';

// components
import LayoutAttributionRequirements from 'layout/app/attribution-requirements';

class AttributionRequirementsPage extends PureComponent {
  static async getInitialProps({ store }) {
    // fetchs static data for attribution & requirements page
    await store.dispatch(getStaticData('api-attribution-requirements'));
    return {};
  }

  render() {
    return (<LayoutAttributionRequirements />);
  }
}


export default AttributionRequirementsPage;
