import React from 'react';
import { setUser } from 'redactions/user';
import { setRouter } from 'redactions/routes';

export default class Page extends React.PureComponent {
  static async getInitialProps({ asPath, pathname, query, req, store, isServer }) {
    const { user } = isServer ? req : store.getState();
    const url = { asPath, pathname, query };
    store.dispatch(setUser(user));
    store.dispatch(setRouter(url));
    return { user, isServer, url };
  }

  componentDidMount() {}
}
