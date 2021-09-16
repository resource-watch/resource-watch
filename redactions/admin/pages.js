import { fetchPages } from 'services/pages';

/**
 * CONSTANTS
*/
const GET_PAGES_SUCCESS = 'pages/GET_PAGES_SUCCESS';
const GET_PAGES_ERROR = 'pages/GET_PAGES_ERROR';
const GET_PAGES_LOADING = 'pages/GET_PAGES_LOADING';
const SET_PAGES_FILTERS = 'pages/SET_PAGES_FILTERS';

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
    filters: [], // Filters for the list of pages
  },
};

/**
 * REDUCER
 * @export
 * @param {initialState} state
 * @param {{ type: string, payload: any }} action
 */
export default function Pages(state = initialState, action) {
  switch (action.type) {
    case GET_PAGES_LOADING: {
      const pages = {
        ...state.pages,
        loading: true,
        error: null,
      };
      return { ...state, pages };
    }

    case GET_PAGES_SUCCESS: {
      const pages = {
        ...state.pages,
        list: action.payload,
        loading: false,
        error: null,
      };
      return { ...state, pages };
    }

    case GET_PAGES_ERROR: {
      const pages = {
        ...state.pages,
        loading: false,
        error: action.payload,
      };
      return { ...state, pages };
    }

    case SET_PAGES_FILTERS: {
      const pages = { ...state.pages, filters: action.payload };
      return { ...state, pages };
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
    dispatch({ type: GET_PAGES_LOADING });

    fetchPages({ env: process.env.NEXT_PUBLIC_ENVS_SHOW })
      .then((data) => {
        dispatch({ type: GET_PAGES_SUCCESS, payload: data });
      })
      .catch((err) => {
        dispatch({ type: GET_PAGES_ERROR, payload: err.message });
      });
  };
}

/**
 * Set the filters for the list of pages
 * @export
 * @param {{ key: string, value: string|number }[]} filters List of filters
 */
export function setFilters(filters) {
  return (dispatch) => dispatch({
    type: SET_PAGES_FILTERS,
    payload: filters,
  });
}
