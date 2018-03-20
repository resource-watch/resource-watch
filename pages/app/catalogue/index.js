/* eslint max-len: 0 */
import React from 'react';

// Components
import Page from 'layout/page';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import * as actions from 'layout/catalog/actions';
import Catalog from 'layout/catalog';

class CatalogPage extends Page {
  render() {
    return <Catalog />;
  }
}

export default withRedux(
  initStore,
  null,
  actions
)(CatalogPage);
