import App from 'next/app';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import { QueryClient, QueryClientProvider } from 'react-query';

// lib
import initStore from 'lib/store';
import MediaContextProvider from 'lib/media';

// es6 shim for .finally() in promises
import finallyShim from 'promise.prototype.finally';

import {
  setUser,
} from 'redactions/user';

// global styles
import 'css/index.scss';

finallyShim.shim();

const queryClient = new QueryClient();

class RWApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const {
      req,
      store,
      isServer,
    } = ctx;

    // sets user data coming from a request (server) or the store (client)
    const { user } = isServer ? req : store.getState();
    if (user) store.dispatch(setUser(user));

    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    return {
      pageProps: {
        ...pageProps,
        user,
        isServer,
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
          <MediaContextProvider>
            <Component {...pageProps} />
          </MediaContextProvider>
        </QueryClientProvider>
      </Provider>
    );
  }
}

export default withRedux(initStore)(RWApp);
