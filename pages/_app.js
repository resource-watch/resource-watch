import App, { Container } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// es6 shim for .finally() in promises
import finallyShim from 'promise.prototype.finally';

// actions
import { setRouter } from 'redactions/routes';
import {
  setUser,
  getUserFavourites,
  getUserCollections
} from 'redactions/user';
import { setMobileDetect, mobileParser } from 'react-responsive-redux';
import { getPublishedTopics } from 'modules/topics/actions';
import { getPublishedPartners } from 'modules/partners/actions';

// utils
import { containsString } from 'utils/string';

// constants
import {
  PAGES_WITHOUT_TOPICS,
  PAGES_WITH_USER_COLLECTIONS,
  FULLSCREEN_PAGES
} from 'constants/app';


finallyShim.shim();

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

    if (user) {
      store.dispatch(setUser(user));
      await store.dispatch(getUserFavourites());

      // fetches user's collections
      if (containsString(pathname, PAGES_WITH_USER_COLLECTIONS)) {
        await store.dispatch(getUserCollections());
      }
    }

    // fetches published topics to populate topics menu in the app header
    if (!containsString(pathname, PAGES_WITHOUT_TOPICS)) await store.dispatch(getPublishedTopics());

    // fetches partners for footer
    if (!containsString(pathname, FULLSCREEN_PAGES)) await store.dispatch(getPublishedPartners());

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
