import React from 'react';

// redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// components
import Page from 'layout/page';
import ForgotPassword from 'layout/forgot-password';

class ForgotPasswordPage extends Page {
  render() {
    return (<ForgotPassword />);
  }
}

export default withRedux(
  initStore,
  null,
  null
)(ForgotPasswordPage);
