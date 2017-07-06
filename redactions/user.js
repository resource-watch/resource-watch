/* global config */
import 'isomorphic-fetch';

/**
 * CONSTANTS
*/
const SET_USER = 'user/SET_USER';


/**
 * REDUCER
*/
const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_USER: {
      return Object.assign({}, state, {
        user: action.payload
      });
    }

    default:
      return state;
  }
}

/**
 * ACTIONS
 * - setUser
*/
export function setUser(user) {
  return dispatch => dispatch({ type: SET_USER, payload: user });
}
