import 'isomorphic-fetch';
import { fetchDashboards, deleteDashboard } from 'services/dashboard';

// utils
import sortBy from 'lodash/sortBy';

/**
 * CONSTANTS
*/
const GET_DASHBOARDS_SUCCESS = 'dashboards/GET_DASHBOARDS_SUCCESS';
const GET_DASHBOARDS_ERROR = 'dashboards/GET_DASHBOARDS_ERROR';
const GET_DASHBOARDS_LOADING = 'dashboards/GET_DASHBOARDS_LOADING';

const SET_DASHBOARDS_FILTERS = 'dashboards/SET_DASHBOARDS_FILTERS';

const DELETE_DASHBOARD_SUCCESS = 'dashboards/DELETE_DASHBOARD_SUCCESS';
const DELETE_DASHBOARD_ERROR = 'dashboards/DELETE_DASHBOARD_ERROR';
const DELETE_DASHBOARD_LOADING = 'dashboards/DELETE_DASHBOARD_LOADING';

/**
 * STORE
 * @property {string} dashboards.error
 * @property {{ key: string, value: string|number }[]} dashboards.filters
 */
const initialState = {
  dashboards: {
    list: [], // Actual list of dashboards
    loading: false, // Are we loading the data?
    error: null, // An error was produced while loading the data
    filters: [], // Filters for the list of dashboards
  },
};

// const service = new DashboardsService();

/**
 * REDUCER
 * @export
 * @param {initialState} state
 * @param {{ type: string, payload: any }} action
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_DASHBOARDS_LOADING: {
      const dashboards = {
        ...state.dashboards,
        loading: true,
        error: null,
      };
      return { ...state, dashboards };
    }

    case GET_DASHBOARDS_SUCCESS: {
      const dashboards = {
        ...state.dashboards,
        list: action.payload,
        loading: false,
        error: null,
      };
      return { ...state, dashboards };
    }

    case GET_DASHBOARDS_ERROR: {
      const dashboards = {
        ...state.dashboards,
        loading: false,
        error: action.payload,
      };
      return { ...state, dashboards };
    }

    case SET_DASHBOARDS_FILTERS: {
      const dashboards = { ...state.dashboards, filters: action.payload };
      return { ...state, dashboards };
    }

    default:
      return state;
  }
}

/**
 * ACTIONS
 */

/**
 * Retrieve the list of dashboards
 * @export
 * @param {string[]} applications Name of the applications to load the dashboards from
 */
export const getDashboards = (options, headers) => (dispatch) => {
  dispatch({ type: GET_DASHBOARDS_LOADING });

  fetchDashboards(options, headers)
    .then((data) => { dispatch({ type: GET_DASHBOARDS_SUCCESS, payload: sortBy(data, 'name') }); })
    .catch((err) => { dispatch({ type: GET_DASHBOARDS_ERROR, payload: err.message }); });
};

/**
 * Set the filters for the list of dashboards
 * @export
 * @param {{ key: string, value: string|number }[]} filters List of filters
 */
export function setFilters(filters) {
  return (dispatch) => dispatch({
    type: SET_DASHBOARDS_FILTERS,
    payload: filters,
  });
}

/**
 * Delete current dashboard
 * @export
 * @param {string[]} applications Name of the applications to load the dashboards from
 */
export function onDeleteDashboard({ id }) {
  return (dispatch, getState) => {
    const { user: { token } } = getState();
    dispatch({ type: DELETE_DASHBOARD_LOADING });

    return deleteDashboard(id, token)
      .then((data) => {
        dispatch({ type: DELETE_DASHBOARD_SUCCESS, payload: data });
      })
      .catch((err) => {
        dispatch({ type: DELETE_DASHBOARD_ERROR, payload: err.message });
      });
  };
}
