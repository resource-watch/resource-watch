import PropTypes from 'prop-types';
import {
  Provider as AuthenticationProvider,
} from 'next-auth/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';

// lib
import wrapper from 'lib/store';
import MediaContextProvider from 'lib/media';

// es6 shim for .finally() in promises
import finallyShim from 'promise.prototype.finally';

// global styles
import 'css/index.scss';

finallyShim.shim();

const queryClient = new QueryClient();

const ResourceWatchApp = ({
  Component,
  pageProps,
}) => (
  <QueryClientProvider client={queryClient}>
    <MediaContextProvider>
      <Hydrate state={pageProps.dehydratedState}>
        <AuthenticationProvider
          session={pageProps.session}
          options={{
            clientMaxAge: 5 * 60, // Re-fetch session if cache is older than 60 seconds
            keepAlive: 10 * 60, // Send keepAlive message every 10 minutes
          }}
        >
          <Component {...pageProps} />
        </AuthenticationProvider>
      </Hydrate>
    </MediaContextProvider>
  </QueryClientProvider>
);

ResourceWatchApp.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
  pageProps: PropTypes.shape({
    session: PropTypes.shape({}),
    dehydratedState: PropTypes.shape({}),
  }).isRequired,
};

export default wrapper.withRedux(ResourceWatchApp);
