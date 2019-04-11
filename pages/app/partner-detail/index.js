import React, { PureComponent } from 'react';

// actions
import { getPartner, getDatasetsByPartner } from 'modules/partners/actions';

// components
import LayoutPartnerDetail from 'layout/app/partner-detail';

// constants
import { PARTNERS_CONNECTIONS } from 'constants/partners';

class PartnerDetailPage extends PureComponent {
  static async getInitialProps({ store, query }) {
    const { id } = query;
    await store.dispatch(getPartner(id));

    if (PARTNERS_CONNECTIONS[id]) {
      await store.dispatch(getDatasetsByPartner(PARTNERS_CONNECTIONS[id]));
    }

    return {};
  }

  render() {
    return (<LayoutPartnerDetail />);
  }
}

export default PartnerDetailPage;
