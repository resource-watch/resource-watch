/* global config */
import 'isomorphic-fetch';

/**
 * CONSTANTS
*/
const GET_USER_REGISTER_SUCCESS = 'explore/GET_USER_REGISTER_SUCCESS';
const GET_USER_LOGIN_SUCCESS = 'explore/GET_USER_LOGIN_SUCCESS';

const GET_USER_ERROR = 'explore/GET_USER_ERROR';
const GET_USER_LOADING = 'explore/GET_USER_LOADING';


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
    case GET_USER_REGISTER_SUCCESS: {
      return Object.assign({}, state, {
        list: action.payload,
        loading: false,
        error: false
      });
    }

    case GET_USER_LOGIN_SUCCESS: {
      return Object.assign({}, state, {
        list: action.payload,
        loading: false,
        error: false
      });
    }

    case GET_USER_ERROR: {
      return Object.assign({}, state, {
        loading: false,
        error: true
      });
    }

    case GET_USER_LOADING: {
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
    dispatch({ type: GET_USER_LOADING });
    // TODO: remove the date now
    fetch(new Request(`${process.env.CMS_API_URL}/api/partners`))
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
          type: GET_USER_ERROR,
          payload: err.message
        });
      });
  };
}
