import UserService from 'services/UserService';

const service = new UserService({ apiURL: process.env.CONTROL_TOWER_URL });

/**
 * CONSTANTS
*/
const SET_USER = 'user/SET_USER';
const SET_USER_FAVOURITES = 'user/SET_USER_FAVOURITES';
const SET_USER_FAVOURITES_LOADING = 'user/SET_USER_FAVOURITES_LOADING';
const SET_USER_FAVOURITES_ERROR = 'user/SET_USER_FAVOURITES_ERROR';


/**
 * REDUCER
*/
const initialState = {
  favourites: [],
  favouritesLoading: false,
  favouritesError: null
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
 * - setUser
 * - setFavourites
 * - toggleFavourite
*/
export function setUser(user) {
  return (dispatch) => {
    if (!user) {
      // If the user isn't logged in, we set the user variable as an empty object
      return;
    }

    const userObj = { ...user };
    if (userObj.token) {
      userObj.token = userObj.token.includes('Bearer') ? userObj.token : `Bearer ${userObj.token}`;
    }

    dispatch({ type: SET_USER, payload: userObj });

    dispatch(setFavourites());
  };
}

//   // const id = payload.id;
//   // const { user } = getState();
//   // const { favourite, widget } = payload;
//   //
//   //
//   // if (favourite.id) {
//   //   userService.deleteFavourite(favourite.id, user.token)
//   //     .then(() => {
//   //       dispatch(setFavouriteLoading({ id, value: false }));
//   //       dispatch(setFavouriteError({ id, value: null }));
//   //
//   //       dispatch(setFavourites());
//   //     })
//   //     .catch((err) => {
//   //       dispatch(setFavouriteLoading({ id, value: false }));
//   //       dispatch(setFavouriteError({ id, value: err }));
//   //       toastr.error('Error', err);
//   //     });
//   // } else {
//   //   userService.createFavourite('widget', widget.id, user.token)
//   //     .then(({ data }) => {
//   //       dispatch(setFavouriteLoading({ id, value: false }));
//   //       dispatch(setFavouriteError({ id, value: null }));
//   //
//   //       dispatch(setFavourites());
//   //     })
//   //     .catch((err) => {
//   //       dispatch(setFavouriteLoading({ id, value: false }));
//   //       dispatch(setFavouriteError({ id, value: err }));
//   //       toastr.error('Error', err);
//   //     });
//   // }
// });

// FAVOURITES
export function setFavouriteLoading(payload) {
  return { type: SET_USER_FAVOURITES_LOADING, payload };
}

export function setFavouriteError(payload) {
  return { type: SET_USER_FAVOURITES_ERROR, payload };
}

export function setFavourites() {
  return (dispatch, getState) => {
    const { user } = getState();

    return service.setFavourites(user.token)
      .then(({ data }) => {
        dispatch({ type: SET_USER_FAVOURITES, payload: data });
      })
      .catch(() => {
        dispatch({ type: SET_USER_FAVOURITES, payload: [] });
      });
  };
}

export function toggleFavourite({ favourite = {}, resource, user }) {
  return (dispatch) => {
    if (favourite.id) {
      return service.deleteFavourite(favourite.id, user.token)
        .then(() => {
          return dispatch(setFavourites());
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      return service.createFavourite(resource.type, resource.id, user.token)
        .then(() => {
          return dispatch(setFavourites());
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };
}
