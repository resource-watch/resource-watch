import React from 'react';

// Components
import Page from 'layout/page';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

import { getStaticPage } from 'modules/static-pages/actions';

import Topics from 'layout/topics';

class TopicsPage extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);

    await context.store.dispatch(getStaticPage('topics'));

    return props;
  }

  render() {
    return <Topics />;
  }
}

export default withRedux(
  initStore,
  null,
  null
)(TopicsPage);
