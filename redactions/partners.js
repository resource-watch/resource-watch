/* global config */
import 'whatwg-fetch';

/**
 * CONSTANTS
*/
const GET_PARTNERS_SUCCESS = 'explore/GET_PARTNERS_SUCCESS';
const GET_PARTNERS_ERROR = 'explore/GET_PARTNERS_ERROR';
const GET_PARTNERS_LOADING = 'explore/GET_PARTNERS_LOADING';

/**
 * REDUCER
*/
const initialState = {
  list: [],
  loading: false,
  error: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_PARTNERS_SUCCESS: {
      return Object.assign({}, state, {
        list: action.payload,
        loading: false,
        error: false
      });
    }

    case GET_PARTNERS_ERROR: {
      return Object.assign({}, state, {
        loading: false,
        error: true
      });
    }

    case GET_PARTNERS_LOADING: {
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
 * - getPartners
*/
export function getPartners() {
  return (dispatch) => {
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_PARTNERS_LOADING });
    // TODO: remove the date now
    fetch(new Request(`${config.CMS_API_URL}/api/partners`))
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((response) => {
        // TODO: filter by those who are featured
        const partners = response.data;

        dispatch({
          type: GET_PARTNERS_SUCCESS,
          payload: partners
        });
      })
      .catch((err) => {
        // Fetch from server ko -> Dispatch error
        dispatch({
          type: GET_PARTNERS_ERROR,
          payload: err.message
        });
      });
  };
}
