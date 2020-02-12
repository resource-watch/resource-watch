import App from 'next/app';
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
import { getFeaturedDashboards } from 'modules/dashboards/actions';
import { getPublishedPartners } from 'modules/partners/actions';
import { setHostname } from 'redactions/common';

// utils
import { containsString } from 'utils/string';

// constants
import {
  PAGES_WITHOUT_DASHBOARDS,
  PAGES_WITH_USER_COLLECTIONS,
  PAGES_WITH_USER_COLLECTIONS_FORCE,
  FULLSCREEN_PAGES
} from 'constants/app';

// global styles
import 'css/index.scss';

finallyShim.shim();

class RWApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    const { asPath } = router;
    const { req, store, query, isServer } = ctx;
    const pathname = req ? asPath : ctx.asPath;

    // sets app routes
    const url = { asPath, pathname, query };
    store.dispatch(setRouter(url));

    // sets hostname
    const hostname = isServer ? req.headers.host : window.origin;
    store.dispatch(setHostname(hostname));

    // sets user data coming from a request (server) or the store (client)
    const { user } = isServer ? req : store.getState();
    const {
      dashboards: { featured: { list: featuredDashboards } },
      partners: { published: { list: publishedPartners } },
      user: {
        favourites: { items: userFavorites, isFirstLoad: userFavoritesFirstLoad },
        collections: { items: userCollections, isFirstLoad: userCollectionsFirstLoad }
      }
    } = store.getState();
    if (user) {
      store.dispatch(setUser(user));

      // fetches user's favorites
      if (!userFavorites.length && !userFavoritesFirstLoad) {
        await store.dispatch(getUserFavourites());
      }
      // fetches user's collections
      if (
        (
          !userCollections.length &&
          !userCollectionsFirstLoad &&
          containsString(pathname, PAGES_WITH_USER_COLLECTIONS)
        ) ||
        containsString(pathname, PAGES_WITH_USER_COLLECTIONS_FORCE)
      ) {
        await store.dispatch(getUserCollections());
      }
    }

    // fetches published featured dashboards to populate dashboars menu in the app header and footer
    if (!containsString(pathname, PAGES_WITHOUT_DASHBOARDS) && !featuredDashboards.length) {
      await store.dispatch(getFeaturedDashboards());
    }
    // fetches partners for footer
    if (!containsString(pathname, FULLSCREEN_PAGES) && !publishedPartners.length) {
      await store.dispatch(getPublishedPartners());
    }

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
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    );
  }
}

export default withRedux(initStore)(RWApp);
