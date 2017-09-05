import isEmpty from 'lodash/isEmpty';
import UserService from 'services/UserService';

const service = new UserService({ apiURL: process.env.CONTROL_TOWER_URL });

/**
 * CONSTANTS
*/
const SET_USER = 'user/SET_USER';
const GET_USER_FAVORITES = 'user/GET_USER_FAVORITES';


/**
 * REDUCER
*/
const initialState = {
  // id: null,
  // role: null,
  // provider: null,
  // token: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_USER: {
      return Object.assign({}, state, action.payload);
    }

    case GET_USER_FAVORITES: {
      return Object.assign({}, state, { favourites: action.payload });
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
  const userObj = Object.assign({}, user || {});
  if (!isEmpty(userObj) && userObj.token) {
    userObj.token = userObj.token.includes('Bearer') ? userObj.token : `Bearer ${userObj.token}`;
  }
  return dispatch => dispatch({ type: SET_USER, payload: userObj });
}

export function getFavourites() {
  return (dispatch, getState) => {
    const { user } = getState();
    return service.getFavourites(`Bearer ${user.token}`)
      .then((response) => {
        dispatch({ type: GET_USER_FAVORITES, payload: response });
      });
  };
}
