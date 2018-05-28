import { createAction } from 'redux-tools';

// Actions
export const setMobileOpened = createAction('HEADER_SET_MOBILE_OPENED');
export const setDropdownOpened = createAction('HEADER_SET_DROPDOWN_OPENED');
export const setSearchOpened = createAction('HEADER_SET_SEARCH_OPENED');
export const setSearchTerm = createAction('HEADER_SET_SEARCH_TERM');

export const setItem = createAction('HEADER_SET_ITEM');
