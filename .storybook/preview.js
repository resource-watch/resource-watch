import { QueryClient, QueryClientProvider } from 'react-query';
import {
  Icons as VizzIcons,
} from 'vizzuality-components';
import Icons from 'components/icons';

import MediaContextProvider from 'lib/media';

// global styles
import 'css/index.scss';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

const queryClient = new QueryClient();

export const decorators = [
  (Story) => (
    <QueryClientProvider client={queryClient}>
      <MediaContextProvider>
        <>
          <VizzIcons />
          <Icons />
          {Story()}
        </>
      </MediaContextProvider>
    </QueryClientProvider>
  ),
];
