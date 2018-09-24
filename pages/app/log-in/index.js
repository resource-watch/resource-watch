import React from 'react';

// redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// components
import Page from 'layout/page';
import Login from 'layout/log-in';

class LoginPage extends Page {
  render() {
    return (<Login />);
  }
}

export default withRedux(
  initStore,
  null,
  null
)(LoginPage);
