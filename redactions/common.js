import { push } from 'react-router-redux';

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
  return dispatch => {
    dispatch(push(url));
  };
}
