import React, { PureComponent } from 'react';

// actions
import { getAllTopics } from 'modules/topics/actions';

// components
import AdminTopicsLayout from 'layout/admin/topics';

class AdminTopicsPage extends PureComponent {
  static async getInitialProps({ store }) {
    const { dispatch } = store;

    await dispatch(getAllTopics());

    return {};
  }

  render() {
    return (<AdminTopicsLayout {...this.props} />);
  }
}

export default AdminTopicsPage;
