import { PureComponent } from 'react';
import { setUser, getUserFavourites, getUserCollections } from 'redactions/user';
import { setRouter } from 'redactions/routes';
import { setMobileDetect, mobileParser } from 'react-responsive-redux';

export default class Page extends PureComponent {
  static async getInitialProps({
    asPath,
    pathname,
    query,
    req,
    store,
    isServer
  }) {
    // Routes
    const url = { asPath, pathname, query };
    store.dispatch(setRouter(url));

    // User favourites and collection
    const { user } = isServer ? req : store.getState();
    await store.dispatch(setUser(user));
    await store.dispatch(getUserFavourites());
    await store.dispatch(getUserCollections());

    // Mobile detection
    if (isServer) {
      const mobileDetect = mobileParser(req);
      store.dispatch(setMobileDetect(mobileDetect));
    }

    return { user, isServer, url };
  }
}
