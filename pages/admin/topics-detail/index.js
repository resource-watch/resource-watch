import React, { PureComponent } from 'react';

// actions
import { getTopic } from 'modules/topics/actions';

// components
import AdminTopicsDetailLayout from 'layout/admin/topics-detail';

class AdminTopicsDetailPage extends PureComponent {
  static async getInitialProps({ store, query }) {
    const { dispatch } = store;
    const { id } = query;

    // fetchs the topic data
    if (id && id !== 'new') await dispatch(getTopic(id));

    return {};
  }

  render() {
    return (<AdminTopicsDetailLayout {...this.props} />);
  }
}

export default AdminTopicsDetailPage;
