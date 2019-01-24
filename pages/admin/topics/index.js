import React from 'react';

// redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { getAllTopics } from 'modules/topics/actions';

// layout
import Page from 'layout/page';
import AdminTopics from 'layout/admin/topics';

class AdminTopicsPage extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);

    // fetchs all topics without any filter
    await context.store.dispatch(getAllTopics());

    return props;
  }

  render() {
    return (<AdminTopics {...this.props} />);
  }
}

export default withRedux(
  initStore,
  null,
  null
)(AdminTopicsPage);
