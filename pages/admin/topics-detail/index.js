import React from 'react';

// redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// actions
import { getTopic } from 'modules/topics/actions';

// layout
import Page from 'layout/page';

// components
import AdminTopicsDetailLayout from 'layout/admin/topics-detail';

class AdminTopicsDetailPage extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    const { store } = context;
    const { url: { query: { id } } } = props;

    // fetchs the topic data
    if (id && id !== 'new') await store.dispatch(getTopic(id));

    return props;
  }

  render() {
    return (<AdminTopicsDetailLayout {...this.props} />);
  }
}

export default withRedux(
  initStore,
  null,
  null
)(AdminTopicsDetailPage);
