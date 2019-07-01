import 'isomorphic-fetch';
import queryString from 'query-string';
import { createAction, createThunkAction } from 'redux-tools';

// Actions
export const setWidgets = createAction('WIDGET_BLOCK_EDITION_GET_WIDGETS');
export const setLoading = createAction('WIDGET_BLOCK_EDITION_LOADING');
export const setError = createAction('WIDGET_BLOCK_EDITION_ERROR');
export const setTab = createAction('WIDGET_BLOCK_EDITION_TAB');
export const setPage = createAction('WIDGET_BLOCK_EDITION_PAGE');
export const setPages = createAction('WIDGET_BLOCK_EDITION_PAGES');
export const setPageSize = createAction('WIDGET_BLOCK_EDITION_PAGE_SIZE');
export const setTotal = createAction('WIDGET_BLOCK_EDITION_TOTAL');
export const setSearch = createAction('WIDGET_BLOCK_EDITION_SEARCH');


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
