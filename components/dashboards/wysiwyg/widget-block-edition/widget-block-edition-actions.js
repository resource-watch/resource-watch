import 'isomorphic-fetch';
import queryString from 'query-string';
import { createAction, createThunkAction } from 'redux-actions';

// Actions
export const setWidgets = createAction('WIDGET_BLOCK_EDITION_WIDGETS');
export const setLoading = createAction('WIDGET_BLOCK_EDITION_LOADING');
export const setError = createAction('WIDGET_BLOCK_EDITION_ERROR');
export const setTab = createAction('WIDGET_BLOCK_EDITION_TAB');
export const setPage = createAction('WIDGET_BLOCK_EDITION_PAGE');
export const setPageSize = createAction('WIDGET_BLOCK_EDITION_PAGE_SIZE');
export const setTotal = createAction('WIDGET_BLOCK_EDITION_TOTAL');


// Async actions
export const fetchWidgets = createThunkAction('WIDGET_BLOCK_EDITION_FETCH_DATA', (payload = {}) => (dispatch) => {
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

  fetch(`${process.env.WRI_API_URL}/widget?${qParams}`)
    .then(response => response.json())
    .then(({ data }) => {
      dispatch(setLoading(false));
      dispatch(setError(null));
      dispatch(setWidgets(data));
      dispatch(setTotal(50));
    })
    .catch((err) => {
      dispatch(setLoading(false));
      dispatch(setError(err));
    });
});
