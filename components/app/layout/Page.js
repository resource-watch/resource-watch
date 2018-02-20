import { PureComponent } from 'react';
import { setUser, getUserFavourites, getUserCollections } from 'redactions/user';
import { setRouter } from 'redactions/routes';

export default class Page extends PureComponent {
  static async getInitialProps({ asPath, pathname, query, req, store, isServer }) {
    const { user } = isServer ? req : store.getState();
    const url = { asPath, pathname, query };
    store.dispatch(setRouter(url));
    await store.dispatch(setUser(user));
    await store.dispatch(getUserFavourites());
    await store.dispatch(getUserCollections());

    return { user, isServer, url };
  }
}
