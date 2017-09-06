/**
 * CONSTANTS
*/
const SET_IS_LOADING = 'page/SET_IS_LOADING';

/**
 * REDUCER
*/
const initialState = {
  isLoading: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_IS_LOADING: {
      return Object.assign({}, state, { isLoading: action.payload });
    }
    default:
      return state;
  }
}

export function updateIsLoading(isLoading) {
  return dispatch => dispatch({ type: SET_IS_LOADING, payload: isLoading });
}
