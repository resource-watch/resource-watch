import React, { PureComponent } from 'react';

// components
import AdminTopicsLayout from 'layout/admin/topics';

class AdminTopicsPage extends PureComponent {
  render() {
    return (<AdminTopicsLayout {...this.props} />);
  }
}

export default AdminTopicsPage;
