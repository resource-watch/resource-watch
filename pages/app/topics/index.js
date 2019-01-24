import React from 'react';

// Components
import Page from 'layout/page';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

import { getStaticData } from 'redactions/static_pages';

import Topics from 'layout/topics';

class TopicsPage extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);

    await context.store.dispatch(getStaticData('topics'));

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
