import 'isomorphic-fetch';
import queryString from 'query-string';
import { createAction, createThunkAction } from 'redux-tools';

// Actions
export const setDashboardThumbnailList = createAction('DASHBOARD_THUMBNAIL_LIST_GET');
export const setLoading = createAction('DASHBOARD_THUMBNAIL_LIST_LOADING');
export const setError = createAction('DASHBOARD_THUMBNAIL_LIST_ERROR');
export const setSelected = createAction('DASHBOARD_THUMBNAIL_LIST_SELECTED');
export const setExpanded = createAction('DASHBOARD_THUMBNAIL_LIST_EXPANDED');
export const setTotal = createAction('DASHBOARD_THUMBNAIL_LIST_TOTAL');
export const setPagination = createAction('DASHBOARD_THUMBNAIL_LIST_PAGINATION');

// Async actions
export const fetchDashboards = createThunkAction('DASHBOARD_THUMBNAIL_LIST_FETCH_DATA', (payload = {}) => (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  const qParams = queryString.stringify({
    sort: 'name',
    ...payload.filters
  });

  return fetch(new Request(`${process.env.API_URL}/dashboards?${qParams}`))
    .then(response => response.json())
    .then(({ data }) => {
      dispatch(setLoading(false));
      dispatch(setError(null));
      dispatch(setTotal(data.length));
      dispatch(setDashboardThumbnailList(data.map(d =>
        ({ id: d.id, ...d.attributes })
      )));
    })
    .catch((err) => {
      dispatch(setLoading(false));
      dispatch(setError(err));
    });
});
