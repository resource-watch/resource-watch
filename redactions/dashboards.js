/* global config */
import 'isomorphic-fetch';
import DASHBOARDS from 'utils/dashboards/config';
import DashboardsService from 'services/DashboardsService';

const service = new DashboardsService();

/**
 * CONSTANTS
*/
const GET_DASHBOARDS_SUCCESS = 'explore/GET_DASHBOARDS_SUCCESS';
const GET_DASHBOARDS_ERROR = 'explore/GET_DASHBOARDS_ERROR';
const GET_DASHBOARDS_LOADING = 'explore/GET_DASHBOARDS_LOADING';
const SET_DASHBOARDS_FILTERS = 'dashboards/SET_DASHBOARDS_FILTERS';

/**
 * STORE
 * @property {string} dashboards.error
 * @property {{ key: string, value: string|number }[]} dashboards.filters
 */
const initialState = {
  list: [], // Actual list of dashboards
  loading: false, // Are we loading the data?
  error: null, // An error was produced while loading the data
  filters: [] // Filters for the list of dashboards
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_DASHBOARDS_SUCCESS: {
      return Object.assign({}, state, {
        list: action.payload,
        loading: false,
        error: null
      });
    }

    case GET_DASHBOARDS_ERROR: {
      return Object.assign({}, state, {
        loading: false,
        error: action.payload
      });
    }

    case GET_DASHBOARDS_LOADING: {
      return Object.assign({}, state, {
        loading: true,
        error: null
      });
    }

    case SET_DASHBOARDS_FILTERS: {
      return Object.assign({}, state, { filters: action.payload });
    }

    default:
      return state;
  }
}

/**
 * ACTIONS
 * - getDashboards
*/
export function getPublicDashboards() {
  return (dispatch) => {
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_DASHBOARDS_LOADING });
    // TODO: remove the date now
    return fetch(new Request(`${process.env.API_URL}/dashboards?fields[dashboards]=name,slug,photo&filter[published]=true&published=true`))
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((response) => {
        dispatch({
          type: GET_DASHBOARDS_SUCCESS,
          payload: [...DASHBOARDS, ...response.data.map(d => d.attributes)]
        });
      })
      .catch((err) => {
        // Fetch from server ko -> Dispatch error
        dispatch({
          type: GET_DASHBOARDS_ERROR,
          payload: err.message
        });
      });
  };
}


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
