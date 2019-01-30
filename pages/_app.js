import App, { Container } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { setUser, getUserFavourites, getUserCollections } from 'redactions/user';
import { setRouter } from 'redactions/routes';
import { fetchTopics } from 'redactions/topics/actions';
import { setMobileDetect, mobileParser } from 'react-responsive-redux';
import { setMobileOpened, setItem } from 'layout/header/header-actions';

import 'css/index.scss';

class RWApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    const { asPath } = router;
    const { req, store, query, isServer } = ctx;
    const pathname = req ? asPath : ctx.asPath;

    // Routes
    const url = { asPath, pathname, query };
    store.dispatch(setRouter(url));

    // User favourites and collection
    const { user } = isServer ? req : store.getState();
    console.log(user)
    await store.dispatch(setUser(user));
    await store.dispatch(getUserFavourites());
    await store.dispatch(getUserCollections());

    // Get topics
    await store.dispatch(fetchTopics({ filters: { 'filter[published]': 'true' } }));
    const { topicsMenu: { topics } } = store.getState();

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

    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    return { pageProps: { ...pageProps, user, isServer, url } };
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

export default withRedux(initStore)(RWApp);
