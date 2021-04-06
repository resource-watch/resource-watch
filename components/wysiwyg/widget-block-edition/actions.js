import { createAction } from 'redux-tools';

// Actions
export const SET_WIDGETS = 'SET_WIDGETS';
export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';
export const SET_TAB = 'SET_TAB';
export const SET_PAGE = 'SET_PAGE';
export const SET_PAGES = 'SET_PAGES';
export const SET_PAGE_SIZE = 'SET_PAGE_SIZE';
export const SET_TOTAL = 'SET_TOTAL';
export const SET_SEARCH = 'SET_SEARCH';

export const setWidgets = createAction(SET_WIDGETS);
export const setLoading = createAction(SET_LOADING);
export const setError = createAction(SET_ERROR);
export const setTab = createAction(SET_TAB);
export const setPage = createAction(SET_PAGE);
export const setPages = createAction(SET_PAGES);
export const setPageSize = createAction(SET_PAGE_SIZE);
export const setTotal = createAction(SET_TOTAL);
export const setSearch = createAction(SET_SEARCH);

export default {
  setWidgets,
  setLoading,
  setError,
  setTab,
  setPage,
  setPages,
  setPageSize,
  setTotal,
  setSearch,
};
