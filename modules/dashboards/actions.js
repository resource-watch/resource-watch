import { createAction, createThunkAction } from 'redux-tools';

// service
import { fetchDashboards, fetchDashboard } from 'services/dashboard';

// Actions
export const setDashboards = createAction('DASHBOARDS__SET-DASHBOARDS');
export const setDashboard = createAction('DASHBOARDS__SET-DASHBOARD');
export const setLoading = createAction('DASHBOARDS__SET-LOADING');
export const setError = createAction('DASHBOARDS__SET-ERROR');

export const getPublishedDashboards = createThunkAction('DASHBOARDS__GET-PUBLISHED-DASHBOARDS',
  () => (dispatch) => {
    const params = { 'filter[published]': 'true' };

    dispatch(setLoading({ key: 'published', value: true }));
    dispatch(setError({ key: 'published', value: null }));

    return fetchDashboards(params)
      .then((dashboards) => {
        dispatch(setDashboards({ key: 'published', value: dashboards }));
        dispatch(setLoading({ key: 'published', value: false }));
      })
      .catch((err) => {
        dispatch(setError({ key: 'published', value: err.message }));
        dispatch(setLoading({ key: 'published', value: false }));
      });
  });

export const getDashboard = createThunkAction('DASHBOARDS__GET-DASHBOARD',
  id => (dispatch) => {
    if (!id) throw new Error('A dashboard ID is mandatory to perform this action.');
    dispatch(setLoading({ key: 'detail', value: true }));
    dispatch(setError({ key: 'detail', value: null }));

    return fetchDashboard(id)
      .then((dashboard) => {
        dispatch(setDashboard({ key: 'detail', value: dashboard }));
        dispatch(setLoading({ key: 'detail', value: false }));
      })
      .catch((err) => {
        dispatch(setError({ key: 'detail', value: err.message }));
        dispatch(setLoading({ key: 'detail', value: false }));
      });
  });

export default {
  setDashboards,
  setDashboard,
  setLoading,
  setError,
  getPublishedDashboards,
  getDashboard
};
