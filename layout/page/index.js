import { PureComponent } from 'react';
import { setUser, getUserFavourites, getUserCollections } from 'redactions/user';
import { setRouter } from 'redactions/routes';
import { getPublishedTopics } from 'modules/topics/actions';
import { setMobileDetect, mobileParser } from 'react-responsive-redux';
import { setMobileOpened } from 'layout/header/actions';
import { setHostname } from 'redactions/common';

import 'css/index.scss';

class Page extends PureComponent {
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

    // Hostname
    const hostname = isServer ? req.headers.host : window.location.origin;
    await store.dispatch(setHostname(hostname));

    // User favourites and collection
    const { user } = isServer ? req : store.getState();

    await store.dispatch(setUser(user));
    await store.dispatch(getUserFavourites());
    await store.dispatch(getUserCollections());

    // fetchs published topics to populate topics menu in the app header
    await store.dispatch(getPublishedTopics());

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


export default Page;
