import { createAction } from 'redux-tools';

// actions
export const setMobileOpened = createAction('HEADER_SET_MOBILE_OPENED');
export const setSearchOpened = createAction('HEADER_SET_SEARCH_OPENED');

export default {
  setMobileOpened,
  setSearchOpened,
};
