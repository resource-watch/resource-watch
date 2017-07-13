/* global config */
import 'isomorphic-fetch';

/**
 * CONSTANTS
*/
const GET_PARTNER_SUCCESS = 'explore/GET_PARTNER_SUCCESS';
const GET_PARTNER_ERROR = 'explore/GET_PARTNER_ERROR';
const GET_PARTNER_LOADING = 'explore/GET_PARTNER_LOADING';

/**
 * REDUCER
*/
const initialState = {
  data: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_PARTNER_SUCCESS: {
      return Object.assign({}, state, {
        data: action.payload,
        loading: false,
        error: false
      });
    }

    case GET_PARTNER_ERROR: {
      return Object.assign({}, state, {
        loading: false,
        error: true
      });
    }

    case GET_PARTNER_LOADING: {
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
 * - getPartnerData
*/
export function getPartnerData(id) {
  return (dispatch) => {
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_PARTNER_LOADING });
    // TODO: remove the date now
    fetch(new Request(`${process.env.CMS_API_URL}/partners/${id}`))
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((response) => {
        dispatch({
          type: GET_PARTNER_SUCCESS,
          payload: response.data.attributes
        });
      })
      .catch((err) => {
        // Fetch from server ko -> Dispatch error
        dispatch({
          type: GET_PARTNER_ERROR,
          payload: err.message
        });
      });
  };
}
