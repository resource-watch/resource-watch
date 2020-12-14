import { createSelector } from 'reselect';
import { AdapterModifier } from '@widget-editor/widget-editor';
import RWAdapter from '@widget-editor/rw-adapter';

const getLocale = (state) => state.common.locale;
const getUserToken = (state) => state.user.token;

export const getRWAdapter = createSelector(
  [getLocale, getUserToken],
  (locale, userToken) => AdapterModifier(RWAdapter, {
    endpoint: process.env.WRI_API_URL,
    env: process.env.API_ENV,
    applications: process.env.APPLICATIONS.split(','),
    locale,
    ...userToken && {
      userToken: userToken.split(' ')[1],
    },
  }),
);

export default { getRWAdapter };
