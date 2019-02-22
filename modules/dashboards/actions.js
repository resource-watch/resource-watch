import { createAction, createThunkAction } from 'redux-tools';

// service
import { fetchDashboard } from 'services/dashboard';

// Actions
export const setDashboards = createAction('DASHBOARDS__SET-DASHBOARD');
export const setLoading = createAction('DASHBOARDS__SET-LOADING');
export const setError = createAction('DASHBOARDS__SET-ERROR');

export const getDashboard = createThunkAction('DASHBOARDS__GET-DASHBOARD',
  id => (dispatch) => {
    if (!id) throw new Error('A dashboard ID is mandatory to perform this action.');
    dispatch(setLoading({ key: 'detail', value: true }));
    dispatch(setError({ key: 'detail', value: null }));

    return fetchDashboard(id)
      .then((dashboard) => {
        dispatch(setDashboards({ key: 'detail', value: dashboard }));
        dispatch(setLoading({ key: 'detail', value: false }));
      })
      .catch((err) => {
        dispatch(setError({ key: 'detail', value: err }));
        dispatch(setLoading({ key: 'detail', value: false }));
      });
  });

export default {
  setDashboards,
  setLoading,
  setError,
  getDashboard
};
