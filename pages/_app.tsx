import { FC } from 'react';
import type { AppProps } from 'next/app';
import Script from 'next/script';

import { Provider as AuthenticationProvider } from 'next-auth/client';
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

const ResourceWatchApp: FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      {/* Google places API */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?v=weekly&key=${process.env.NEXT_PUBLIC_RW_GOGGLE_API_TOKEN_SHORTENER}&libraries=places`}
      />
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
    </>
  );
};

export default wrapper.withRedux(ResourceWatchApp);