import React, { PureComponent } from 'react';

// actions
import { getDatasets } from 'layout/app/catalog/actions';

// components
import LayoutCatalog from 'layout/app/catalog';

class CatalogPage extends PureComponent {
  static async getInitialProps({ store }) {
    await store.dispatch(getDatasets());
    return {};
  }

  render() {
    return (<LayoutCatalog />);
  }
}

export default CatalogPage;
