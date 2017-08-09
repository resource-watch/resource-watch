import 'isomorphic-fetch';
import PartnersService from 'services/PartnersService';

/**
 * CONSTANTS
*/
const GET_PARTNERS_SUCCESS = 'partners/GET_PARTNERS_SUCCESS';
const GET_PARTNERS_ERROR = 'partners/GET_PARTNERS_ERROR';
const GET_PARTNERS_LOADING = 'partners/GET_PARTNERS_LOADING';
const SET_PARTNERS_FILTERS = 'partners/SET_PARTNERS_FILTERS';

/**
 * STORE
 * @property {string} partners.error
 * @property {{ key: string, value: string|number }[]} partners.filters
 */
const initialState = {
  partners: {
    list: [],       // Actual list of partners
    loading: false, // Are we loading the data?
    error: null,    // An error was produced while loading the data
    filters: []     // Filters for the list of partners
  }
};

const service = new PartnersService();
/**
 * REDUCER
 * @export
 * @param {initialState} state
 * @param {{ type: string, payload: any }} action
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_PARTNERS_LOADING: {
      const partners = Object.assign({}, state.partners, {
        loading: true,
        error: null
      });
      return Object.assign({}, state, { partners });
    }

    case GET_PARTNERS_SUCCESS: {
      const partners = Object.assign({}, state.partners, {
        list: action.payload,
        loading: false,
        error: null
      });
      return Object.assign({}, state, { partners });
    }

    case GET_PARTNERS_ERROR: {
      const partners = Object.assign({}, state.partners, {
        loading: false,
        error: action.payload
      });
      return Object.assign({}, state, { partners });
    }

    case SET_PARTNERS_FILTERS: {
      const partners = Object.assign({}, state.partners, { filters: action.payload });
      return Object.assign({}, state, { partners });
    }

    default:
      return state;
  }
}

/**
 * ACTIONS
 */

/**
 * Retrieve the list of partners
 * @export
 * @param {string[]} applications Name of the applications to load the partners from
 */
export function getPartners() {
  return (dispatch) => {
    dispatch({ type: GET_PARTNERS_LOADING });

    service.fetchAllData()
      .then((data) => {
        dispatch({ type: GET_PARTNERS_SUCCESS, payload: data });
      })
      .catch((err) => {
        dispatch({ type: GET_PARTNERS_ERROR, payload: err.message });
      });
  };
}

/**
 * Set the filters for the list of partners
 * @export
 * @param {{ key: string, value: string|number }[]} filters List of filters
 */
export function setFilters(filters) {
  return dispatch => dispatch({
    type: SET_PARTNERS_FILTERS,
    payload: filters
  });
}
