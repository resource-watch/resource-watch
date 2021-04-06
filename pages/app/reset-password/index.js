import React, { PureComponent } from 'react';

// components
import ResetPassword from 'layout/reset-password';

class ResetPasswordPage extends PureComponent {
  static async getInitialProps({ store }) {
    const { getState } = store;
    const { routes: { query: { tokenEmail } } } = getState();

    return { tokenEmail };
  }

  render() {
    return (<ResetPassword {...this.props} />);
  }
}

export default ResetPasswordPage;
