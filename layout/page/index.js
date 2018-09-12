import { PureComponent } from 'react';
import { setUser, getUserFavourites, getUserCollections } from 'redactions/user';
import { setRouter } from 'redactions/routes';
import { fetchTopics } from 'redactions/topics/actions';
import { setMobileDetect, mobileParser } from 'react-responsive-redux';
import { setItem, setMobileOpened } from 'layout/header/header-actions';

import 'css/index.scss';

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

    // Get topics
    await store.dispatch(fetchTopics({ filters: { 'filter[published]': 'true' } }));
    const { topics } = store.getState().topics;

    store.dispatch(setItem(
      {
        id: 'topics',
        label: 'Topics',
        route: 'topics',
        pathnames: ['/app/topics', '/app/topics-detail'],
        children: topics.map(t => ({ label: t.name, route: 'topics_detail', params: { id: t.slug } }))
      }
    ));


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
