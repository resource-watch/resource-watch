import React from 'react';

// redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// components
import Page from 'layout/page';
import SignIn from 'layout/sign-in';

class SignInPage extends Page {
  render() {
    return (<SignIn />);
  }
}

export default withRedux(
  initStore,
  null,
  null
)(SignInPage);
