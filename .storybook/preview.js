import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
  Icons as VizzIcons,
} from 'vizzuality-components';
import Icons from 'components/icons';

import initStore from 'lib/store';
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
const store = initStore();

export const decorators = [
  (Story) => {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MediaContextProvider>
            <>
              <VizzIcons />
              <Icons />
              {Story()}
            </>
          </MediaContextProvider>
        </QueryClientProvider>
      </Provider>
    );
  },
];
