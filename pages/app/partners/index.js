import React, { PureComponent } from 'react';

// actions
import { getPartners } from 'redactions/admin/partners';

// components
import LayoutPartners from 'layout/app/partners';

class PartnersPage extends PureComponent {
  static async getInitialProps({ store }) {
    const { dispatch, getState } = store;
    const { partners: { published } } = getState();

    if (!published.list.length) await dispatch(getPartners());

    return {};
  }

  render() {
    return (<LayoutPartners />);
  }
}

export default PartnersPage;
