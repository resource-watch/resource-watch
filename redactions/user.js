/* global config */
import 'isomorphic-fetch';
import isEmpty from 'lodash/isEmpty';

/**
 * CONSTANTS
*/
const SET_USER = 'user/SET_USER';


/**
 * REDUCER
*/
const initialState = {
  id: null,
  role: null,
  provider: null,
  token: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_USER: {
      return Object.assign({}, state, action.payload);
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
  let userObj = user;
  // Add 'Bearer' to token
  if (!isEmpty(user)) {
    userObj = {
      ...userObj,
      token: `Bearer ${userObj.token}`
    };
  }
  return dispatch => dispatch({ type: SET_USER, payload: userObj });
}
