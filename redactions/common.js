import { Router } from 'routes';

const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

/**
 * ACTIONS
 */

export function redirectTo(url) {
  return (dispatch) => {
    dispatch(Router.pushRoute(url));
  };
}
