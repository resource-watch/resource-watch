import App, { Container } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// actions
import { setRouter } from 'redactions/routes';
import { setUser } from 'redactions/user';
import { setMobileDetect, mobileParser } from 'react-responsive-redux';
import { getPublishedTopics } from 'modules/topics/actions';
import { getPublishedPartners } from 'modules/partners/actions';

// constants
import {
  PAGES_WITHOUT_TOPICS,
  FULLSCREEN_PAGES
} from 'constants/app';

// app styles
import 'css/index.scss';

class RWApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    const { asPath } = router;
    const { req, store, query, isServer } = ctx;
    const pathname = req ? asPath : ctx.asPath;

    // sets app routes
    const url = { asPath, pathname, query };
    store.dispatch(setRouter(url));

    // sets user data coming from a request (server) or the store (client)
    const { user } = isServer ? req : store.getState();
    if (user) store.dispatch(setUser(user));
    // await store.dispatch(getUserFavourites());
    // await store.dispatch(getUserCollections());

    // fetchs published topics to populate topics menu in the app header
    // TO-DO: check if the user is in the admin zone or not to load the topics
    if (!PAGES_WITHOUT_TOPICS.includes(pathname)) await store.dispatch(getPublishedTopics());

    // fetchs partners for footer
    if (!FULLSCREEN_PAGES.includes(pathname)) await store.dispatch(getPublishedPartners());

    // mobile detection
    if (isServer) {
      const mobileDetect = mobileParser(req);
      store.dispatch(setMobileDetect(mobileDetect));
    }

    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    return { pageProps: { ...pageProps, user, isServer, url } };
  }

  render() {
    const {
      Component,
      pageProps,
      store
    } = this.props;

    return (
      <Container>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}

export default withRedux(initStore)(RWApp);
