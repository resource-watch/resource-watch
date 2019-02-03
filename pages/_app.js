import App, { Container } from 'next/app';
import React from 'react';
// redux
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import initStore from 'store';

// actions
import { setUser } from 'redactions/user';
import { setRouter } from 'redactions/routes';
import { getPublishedTopics } from 'modules/topics/actions';
import { setMobileDetect, mobileParser } from 'react-responsive-redux';

// global styles
import 'css/index.scss';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const { store } = ctx;
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    const { isServer, req, asPath, pathname, query } = pageProps;
    console.log('STORE HERE');
    console.log(store);
    // console.log(ctx)
    // console.log('---- ---- ----')
    // console.log(pageProps)

    // sets user data coming from a request (server) or the store (client)
    // const { user } = isServer ? req : store.getState();
    // store.dispatch(setUser(user));

    // sets app routes
    // store.dispatch(setRouter({ asPath, pathname, query }));

    // fetchs published topics to populate topics menu in the app header
    // TO-DO: check if the user is in the admin zone or not to load the topics
    // await store.dispatch(getPublishedTopics());

    // mobile detection
    // if (isServer) {
    //   const mobileDetect = mobileParser(req);
    //   store.dispatch(setMobileDetect(mobileDetect));
    // }

    return { pageProps };
  }

  render() {
    const { Component, pageProps, store } = this.props;

    return (
      <Container>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}

export default withRedux(initStore)(MyApp);
