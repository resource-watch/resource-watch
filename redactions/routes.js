// CONSTANTS
const SET_ROUTER = 'SET_ROUTER';

// REDUCER
const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ROUTER:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}

// ACTIONS
export function setRouter(router) {
  return { type: SET_ROUTER, payload: router };
}
