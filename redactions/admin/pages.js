import 'isomorphic-fetch';
import PagesService from 'services/PagesService';

/**
 * CONSTANTS
*/
const GET_DASHBOARDS_SUCCESS = 'pages/GET_DASHBOARDS_SUCCESS';
const GET_DASHBOARDS_ERROR = 'pages/GET_DASHBOARDS_ERROR';
const GET_DASHBOARDS_LOADING = 'pages/GET_DASHBOARDS_LOADING';
const SET_DASHBOARDS_FILTERS = 'pages/SET_DASHBOARDS_FILTERS';

/**
 * STORE
 * @property {string} pages.error
 * @property {{ key: string, value: string|number }[]} pages.filters
 */
const initialState = {
  pages: {
    list: [], // Actual list of pages
    loading: false, // Are we loading the data?
    error: null, // An error was produced while loading the data
    filters: [] // Filters for the list of pages
  }
};

const service = new PagesService();
/**
 * REDUCER
 * @export
 * @param {initialState} state
 * @param {{ type: string, payload: any }} action
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_DASHBOARDS_LOADING: {
      const pages = Object.assign({}, state.pages, {
        loading: true,
        error: null
      });
      return Object.assign({}, state, { pages });
    }

    case GET_DASHBOARDS_SUCCESS: {
      const pages = Object.assign({}, state.pages, {
        list: action.payload,
        loading: false,
        error: null
      });
      return Object.assign({}, state, { pages });
    }

    case GET_DASHBOARDS_ERROR: {
      const pages = Object.assign({}, state.pages, {
        loading: false,
        error: action.payload
      });
      return Object.assign({}, state, { pages });
    }

    case SET_DASHBOARDS_FILTERS: {
      const pages = Object.assign({}, state.pages, { filters: action.payload });
      return Object.assign({}, state, { pages });
    }

    default:
      return state;
  }
}

/**
 * ACTIONS
 */

/**
 * Retrieve the list of pages
 * @export
 * @param {string[]} applications Name of the applications to load the pages from
 */
export function getPages() {
  return (dispatch) => {
    dispatch({ type: GET_DASHBOARDS_LOADING });

    service.fetchAllData()
      .then((data) => {
        dispatch({ type: GET_DASHBOARDS_SUCCESS, payload: data });
      })
      .catch((err) => {
        dispatch({ type: GET_DASHBOARDS_ERROR, payload: err.message });
      });
  };
}

/**
 * Set the filters for the list of pages
 * @export
 * @param {{ key: string, value: string|number }[]} filters List of filters
 */
export function setFilters(filters) {
  return dispatch => dispatch({
    type: SET_DASHBOARDS_FILTERS,
    payload: filters
  });
}
