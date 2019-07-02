import 'isomorphic-fetch';
import queryString from 'query-string';
import { createAction, createThunkAction } from 'redux-tools';

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


// Async actions
export const fetchWidgets = createThunkAction('WIDGET_BLOCK_EDITION_FETCH_DATA', (payload = {}) => (dispatch, getState) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  const qParams = queryString.stringify({
    application: [process.env.APPLICATIONS],
    env: process.env.API_ENV,
    sort: 'name',
    'page[number]': 1,
    'page[size]': 9,
    ...payload.filters
  });

  const { user } = getState();

  fetch(`${process.env.WRI_API_URL}/widget?${qParams}`, {
    headers: {
      Authorization: user.token,
      'Upgrade-Insecure-Requests': 1
    }
  })
    .then(response => response.json())
    .then(({ data, meta }) => {
      dispatch(setLoading(false));
      dispatch(setError(null));
      dispatch(setWidgets(data.map(d => ({ id: d.id, ...d.attributes }))));
      dispatch(setTotal(meta['total-items']));
      dispatch(setPages(meta['total-pages']));
    })
    .catch((err) => {
      dispatch(setLoading(false));
      dispatch(setError(err));
    });
});

export default {
  setWidgets,
  setLoading,
  setError,
  setTab,
  setPage,
  setPages,
  setPageSize,
  setTotal,
  setSearch
};
