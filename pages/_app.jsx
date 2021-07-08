import App from 'next/app';
import {
  Provider as AuthenticationProvider,
  getSession,
} from 'next-auth/client';
import { QueryClient, QueryClientProvider } from 'react-query';

// lib
import wrapper from 'lib/store';
import MediaContextProvider from 'lib/media';

// services
import {
  fetchUser,
} from 'services/user';
import { setUser } from 'redactions/user';

// es6 shim for .finally() in promises
import finallyShim from 'promise.prototype.finally';

// utils
import { logger } from 'utils/logs';

// tests
import authPayload from '../cypress/fixtures/auth.json';

// global styles
import 'css/index.scss';

finallyShim.shim();

const queryClient = new QueryClient();

class RWApp extends App {
  static getInitialProps = wrapper.getInitialAppProps((store) => async ({ Component, ctx }) => {
    const {
      isServer,
    } = ctx;

    // provisional way to keep user data in store while authentication is migrated to next-auth
    // todo: remove eventually when components stop consuming the user data from store
    // todo: and remove getInitialProps
    const session = await getSession(ctx);
    const {
      user,
    } = store.getState();

    logger.info(session, 'SESSION');

    if (session && !user?.id) {
      const userData = process.env.TEST_ENV === 'FRONTEND'
        ? authPayload : await fetchUser(`Bearer ${session.accessToken}`);

      store.dispatch(setUser({
        ...userData,
        token: `Bearer ${session.accessToken}`,
      }));
    }

    return {
      pageProps: {
        ...(Component.getInitialProps
          ? await Component.getInitialProps({ ...ctx, store }) : {}),
        isServer,
      },
      store,
    };
  });

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
      <QueryClientProvider client={queryClient}>
        <MediaContextProvider>
          <AuthenticationProvider
            session={pageProps.session}
            options={{
              clientMaxAge: 5 * 60, // Re-fetch session if cache is older than 60 seconds
              keepAlive: 10 * 60, // Send keepAlive message every 10 minutes
            }}
          >
            <Component {...pageProps} />
          </AuthenticationProvider>
        </MediaContextProvider>
      </QueryClientProvider>
    );
  }
}

export default wrapper.withRedux(RWApp);
