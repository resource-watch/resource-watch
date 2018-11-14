import React from 'react';

// redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// components
import Page from 'layout/page';
import ResetPassword from 'layout/reset-password';

class ResetPasswordPage extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    const { store } = context;
    const { routes } = store.getState();
    const { tokenEmail } = routes.query;

    return { ...props, tokenEmail };
  }
  render() {
    return (<ResetPassword {...this.props} />);
  }
}

export default withRedux(
  initStore,
  null,
  null
)(ResetPasswordPage);
