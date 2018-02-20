import { PureComponent } from 'react';
import { setUser, getUserFavourites, getUserCollections } from 'redactions/user';
import { setRouter } from 'redactions/routes';
import { setMobileDetect, mobileParser } from 'react-responsive-redux';
import { setMobileOpened } from 'components/app/layout/header/header-actions';

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

    // Hide mobile header
    store.dispatch(setMobileOpened(false));

    return { user, isServer, url };
  }
}
