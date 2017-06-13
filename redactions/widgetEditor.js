/**
 * CONSTANTS
*/
const ADD_FILTER = 'widgetEditor/ADD_FILTER';
const REMOVE_FILTER = 'widgetEditor/REMOVE_FILTER';
const ADD_COLOR = 'widgetEditor/ADD_COLOR';
const REMOVE_COLOR = 'widgetEditor/REMOVE_COLOR';
const ADD_SIZE = 'widgetEditor/ADD_SIZE';
const REMOVE_SIZE = 'widgetEditor/REMOVE_SIZE';
const ADD_DIMENSION = 'widgetEditor/ADD_DIMENSION';
const REMOVE_DIMENSION = 'widgetEditor/REMOVE_DIMENSION';

/**
 * REDUCER
*/
const initialState = {
  filters: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_FILTER: {
      const filters = state.filters.slice(0);
      const element = action.payload;
      const found = filters.find(val => val.name === element.name);
      if (!found) {
        filters.push(action.payload);
      }
      return Object.assign({}, state, {
        filters
      });
    }

    case REMOVE_FILTER: {
      const filters = state.filters.slice(0);
      const element = action.payload;
      let index = 0;
      for (let i = 0; i < filters.length; i++) {
        if (filters[i].name === element.name) {
          index = i;
        }
      }
      filters.splice(index, 1);
      return Object.assign({}, state, {
        filters
      });
    }

    default:
      return state;
  }
}

/**
 * ACTIONS
 * - addFilter
 * - removeFilter
 * - addColor
 * - removeColor
 * - addSize
 * - removeSize
 * - addDimension
 * - removeDimension
*/
export function addFilter(filter) {
  return dispatch => dispatch({ type: ADD_FILTER, payload: filter });
}
export function removeFilter(filter) {
  return dispatch => dispatch({ type: REMOVE_FILTER, payload: filter });
}
export function addColor(color) {
  return dispatch => dispatch({ type: ADD_COLOR, payload: color });
}
export function removeColor(color) {
  return dispatch => dispatch({ type: REMOVE_COLOR, payload: color });
}
export function addSize(size) {
  return dispatch => dispatch({ type: ADD_SIZE, payload: size });
}
export function removeSize(size) {
  return dispatch => dispatch({ type: REMOVE_SIZE, payload: size });
}
export function addDimension(dimension) {
  return dispatch => dispatch({ type: ADD_DIMENSION, payload: dimension });
}
export function removeDimension(dimension) {
  return dispatch => dispatch({ type: REMOVE_DIMENSION, payload: dimension });
}
