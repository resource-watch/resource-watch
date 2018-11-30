import React from 'react';

// redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// components
import Page from 'layout/page';
import SignIn from 'layout/sign-in';

class SignInPage extends Page {
  // static async getInitialProps(context) {
  //   const props = await super.getInitialProps(context);
  //   const { user, isServer } = props;

  //   console.log(user)

  //   if (isServer && ((user || {}).token)) Router.pushRoute('myrw');

  //   // if the user is already logged-in, move it to /myrw
  //   if ((user && user.token) && typeof window !== 'undefined') {
  //     window.location.href = '/myrw';
  //   }

  //   return { ...props };
  // }

  render() {
    return (<SignIn />);
  }
}

export default withRedux(
  initStore,
  null,
  null
)(SignInPage);
