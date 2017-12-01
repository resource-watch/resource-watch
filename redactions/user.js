import UserService from 'services/UserService';

const service = new UserService({ apiURL: process.env.CONTROL_TOWER_URL });

/**
 * CONSTANTS
*/
const SET_USER = 'user/SET_USER';
const SET_USER_FAVOURITES = 'user/SET_USER_FAVOURITES';


/**
 * REDUCER
*/
const initialState = {
  favourites: []
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

    case SET_USER_FAVOURITES: {
      return Object.assign({}, state, { favourites: action.payload });
    }

    default:
      return state;
  }
}

/**
 * ACTIONS
 * - setFavourites
 * - setUser
*/
export function setFavourites() {
  return (dispatch, getState) => {
    const { user } = getState();

    return service.setFavourites(user.token)
      .then((response) => {
        dispatch({ type: SET_USER_FAVOURITES, payload: response });
      });
  };
}


export function setUser(user) {
  return (dispatch) => {
    if (!user) {
      // If the user isn't logged in, we set the user variable as an empty object
      return dispatch({ type: SET_USER, payload: {} });
    }

    const userObj = { ...user };
    if (userObj.token) {
      userObj.token = userObj.token.includes('Bearer') ? userObj.token : `Bearer ${userObj.token}`;
    }

    dispatch({ type: SET_USER, payload: userObj });

    return dispatch(setFavourites());
  };
}
