/* global config */
import 'isomorphic-fetch';
import find from 'lodash/find';
import DashboardsService from 'services/DashboardsService';
import DASHBOARDS from 'utils/dashboards/config';

const service = new DashboardsService();

/**
 * CONSTANTS
*/
const GET_DASHBOARD_SUCCESS = 'GET_DASHBOARD_DETAIL_SUCCESS';
const GET_DASHBOARD_ERROR = 'GET_DASHBOARD_DETAIL_ERROR';
const GET_DASHBOARD_LOADING = 'GET_DASHBOARD_DETAIL_LOADING';

/**
 * REDUCER
*/
const initialState = {
  data: {},
  loading: false,
  error: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_DASHBOARD_SUCCESS: {
      return Object.assign({}, state, {
        data: action.payload,
        loading: false,
        error: false
      });
    }

    case GET_DASHBOARD_ERROR: {
      return Object.assign({}, state, {
        loading: false,
        error: true
      });
    }

    case GET_DASHBOARD_LOADING: {
      return Object.assign({}, state, {
        loading: true,
        error: false
      });
    }

    default:
      return state;
  }
}

/**
 * ACTIONS
 * - getDashboard
*/
export function getDashboard(slug) {
  return (dispatch) => {
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_DASHBOARD_LOADING });

    const staticDashboards = find(DASHBOARDS, { slug });

    if (staticDashboards) return dispatch({ type: GET_DASHBOARD_SUCCESS, payload: staticDashboards });

    return service.fetchData({ id: slug })
      .then((data) => {
        dispatch({ type: GET_DASHBOARD_SUCCESS, payload: data });
      })
      .catch((err) => {
        dispatch({ type: GET_DASHBOARD_ERROR, payload: err.message });
      });
  };
}
