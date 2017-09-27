/* global config */
import 'isomorphic-fetch';

/**
 * CONSTANTS
*/
const SET_DATASET = 'explore/SET_DATASET';

/**
 * REDUCER
*/
const initialState = {
  dataset: {
    name: '',
    id: '-'
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_DATASET: {
      return Object.assign({}, state, {
        dataset: action.payload
      });
    }

    default:
      return state;
  }
}
/**
 * ACTIONS
 * - setDataset
*/
export function setDataset(dataset) {
  return dispatch => dispatch({ type: SET_DATASET, payload: dataset });
}
