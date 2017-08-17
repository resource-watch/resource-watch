/* global config */
import 'isomorphic-fetch';

/**
 * CONSTANTS
*/
const GET_STATIC_SUCCESS = 'static_pages/GET_STATIC_SUCCESS';
const GET_STATIC_ERROR = 'static_pages/GET_STATIC_ERROR';
const GET_STATIC_LOADING = 'static_pages/GET_STATIC_LOADING';

/**
 * REDUCER
*/
const initialState = {
  loading: false,
  error: false,
  about: {},
  getInvolved: {},
  apps: {},
  'submit-an-insight': {},
  'join-community': {},
  'develop-app': {},
  'contribute-data': {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_STATIC_SUCCESS: {
      const staticData = {};
      staticData[action.payload.name] = action.payload.data;

      return Object.assign({}, state,
        {
          loading: false,
          error: false
        },
        staticData
      );
    }

    case GET_STATIC_ERROR: {
      return Object.assign({}, state, {
        loading: false,
        error: true
      });
    }

    case GET_STATIC_LOADING: {
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
 * - getStaticData
*/
export function getStaticData(slug) {
  return (dispatch) => {
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_STATIC_LOADING });
    return fetch(new Request(`${process.env.API_URL}/static_pages/${slug}`))
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((response) => {
        dispatch({
          type: GET_STATIC_SUCCESS,
          payload: { name: slug, data: response.data.attributes }
        });
      })
      .catch((err) => {
        // Fetch from server ko -> Dispatch error
        dispatch({
          type: GET_STATIC_ERROR,
          payload: err.message
        });
      });
  };
}
