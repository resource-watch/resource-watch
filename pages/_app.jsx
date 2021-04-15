import App from 'next/app';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import { QueryClient, QueryClientProvider } from 'react-query';
import initStore from 'lib/store';

// es6 shim for .finally() in promises
import finallyShim from 'promise.prototype.finally';

// actions
import { setRouter } from 'redactions/routes';
import {
  setUser,
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
  FULLSCREEN_PAGES,
} from 'constants/app';

// global styles
import 'css/index.scss';

finallyShim.shim();

const queryClient = new QueryClient();

class RWApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    const { asPath } = router;
    const {
      req, store, query, isServer,
    } = ctx;
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
    } = store.getState();
    if (user) store.dispatch(setUser(user));

    // fetches published featured dashboards
    // to populate dashboards menu in the app header and footer
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

    return {
      pageProps: {
        ...pageProps, user, isServer, url,
      },
    };
  }

  render() {
    const {
      Component,
      pageProps,
      store,
    } = this.props;

    // expose store when run in Cypress
    if (typeof window !== 'undefined' && window.Cypress) {
      window.store = store;
    }

    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </Provider>
    );
  }
}

export default withRedux(initStore)(RWApp);
