import 'isomorphic-fetch';
import { fetchFaqs, updateFaqOrder } from 'services/faqs';

/**
 * CONSTANTS
*/
const GET_FAQS_SUCCESS = 'faqs/GET_FAQS_SUCCESS';
const GET_FAQS_ERROR = 'faqs/GET_FAQS_ERROR';
const GET_FAQS_LOADING = 'faqs/GET_FAQS_LOADING';
const SET_FAQS_FILTERS = 'faqs/SET_FAQS_FILTERS';
const SET_FAQS_ORDER = 'faq/SET_FAQS_ORDER';
const SET_FAQS_ORDER_LOADING = 'faq/SET_FAQS_ORDER_LOADING';
const SET_FAQS_ORDER_SUCCESS = 'faq/SET_FAQS_ORDER_SUCCESS';
const SET_FAQS_ORDER_ERROR = 'faq/SET_FAQS_ORDER_ERROR';

/**
 * STORE
 * @property {string} faqs.error
 * @property {{ key: string, value: string|number }[]} faqs.filters
 */
const initialState = {
  list: [], // Actual list of faqs
  loading: false, // Are we loading the data?
  error: null, // An error was produced while loading the data
  filters: [], // Filters for the list of faqs
  order: []
};

/**
 * REDUCER
 * @export
 * @param {initialState} state
 * @param {{ type: string, payload: any }} action
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_FAQS_LOADING: {
      const faqs = Object.assign({}, state, {
        loading: true,
        error: null
      });
      return faqs;
    }

    case GET_FAQS_SUCCESS: {
      const faqs = Object.assign({}, state, {
        list: action.payload,
        loading: false,
        error: null
      });
      return faqs;
    }

    case GET_FAQS_ERROR: {
      const faqs = Object.assign({}, state, {
        loading: false,
        error: action.payload
      });
      return faqs;
    }

    case SET_FAQS_FILTERS: {
      const faqs = Object.assign({}, state, { filters: action.payload });
      return faqs;
    }

    case SET_FAQS_ORDER: {
      const faqs = Object.assign({}, state, { order: action.payload });
      return faqs;
    }

    case SET_FAQS_ORDER_SUCCESS: {
      const faqs = Object.assign({}, state, { list: action.payload });
      return faqs;
    }

    default:
      return state;
  }
}

/**
 * ACTIONS
 */

/**
 * Retrieve the list of faqs
 * @export
 * @param {string[]} applications Name of the applications to load the faqs from
 */
export function getFaqs() {
  return (dispatch) => {
    dispatch({ type: GET_FAQS_LOADING });

    return fetchFaqs()
      .then((data) => {
        dispatch({ type: SET_FAQS_ORDER, payload: data.map(d => +d.id) });
        dispatch({ type: GET_FAQS_SUCCESS, payload: data });
      })
      .catch((err) => {
        dispatch({ type: GET_FAQS_ERROR, payload: err.message });
      });
  };
}

/**
 * Update faq order
 * @export
 * @param {string[]} applications Name of the applications to load the faqs from
 */
export function setFaqOrder(order, token) {
  return (dispatch) => {
    dispatch({ type: SET_FAQS_ORDER, payload: order.ids.map(o => +o) });

    dispatch({ type: SET_FAQS_ORDER_LOADING });

    return updateFaqOrder(order, token)
      .then((data) => {
        dispatch({ type: SET_FAQS_ORDER_SUCCESS, payload: data });
      })
      .catch((err) => {
        dispatch({ type: SET_FAQS_ORDER_ERROR, payload: err.message });
      });
  };
}

/**
 * Set the filters for the list of faqs
 * @export
 * @param {{ key: string, value: string|number }[]} filters List of filters
 */
export function setFilters(filters) {
  return dispatch => dispatch({
    type: SET_FAQS_FILTERS,
    payload: filters
  });
}
