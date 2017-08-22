import 'isomorphic-fetch';
import DashboardsService from 'services/DashboardsService';

/**
 * CONSTANTS
*/
const GET_DASHBOARDS_SUCCESS = 'dashboards/GET_DASHBOARDS_SUCCESS';
const GET_DASHBOARDS_ERROR = 'dashboards/GET_DASHBOARDS_ERROR';
const GET_DASHBOARDS_LOADING = 'dashboards/GET_DASHBOARDS_LOADING';
const SET_DASHBOARDS_FILTERS = 'dashboards/SET_DASHBOARDS_FILTERS';

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
    filters: [] // Filters for the list of dashboards
  }
};

const service = new DashboardsService();
/**
 * REDUCER
 * @export
 * @param {initialState} state
 * @param {{ type: string, payload: any }} action
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_DASHBOARDS_LOADING: {
      const dashboards = Object.assign({}, state.dashboards, {
        loading: true,
        error: null
      });
      return Object.assign({}, state, { dashboards });
    }

    case GET_DASHBOARDS_SUCCESS: {
      const dashboards = Object.assign({}, state.dashboards, {
        list: action.payload,
        loading: false,
        error: null
      });
      return Object.assign({}, state, { dashboards });
    }

    case GET_DASHBOARDS_ERROR: {
      const dashboards = Object.assign({}, state.dashboards, {
        loading: false,
        error: action.payload
      });
      return Object.assign({}, state, { dashboards });
    }

    case SET_DASHBOARDS_FILTERS: {
      const dashboards = Object.assign({}, state.dashboards, { filters: action.payload });
      return Object.assign({}, state, { dashboards });
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
export function getDashboards(options) {
  return (dispatch) => {
    dispatch({ type: GET_DASHBOARDS_LOADING });

    service.fetchAllData(options)
      .then((data) => {
        dispatch({ type: GET_DASHBOARDS_SUCCESS, payload: data });
      })
      .catch((err) => {
        dispatch({ type: GET_DASHBOARDS_ERROR, payload: err.message });
      });
  };
}

/**
 * Set the filters for the list of dashboards
 * @export
 * @param {{ key: string, value: string|number }[]} filters List of filters
 */
export function setFilters(filters) {
  return dispatch => dispatch({
    type: SET_DASHBOARDS_FILTERS,
    payload: filters
  });
}
