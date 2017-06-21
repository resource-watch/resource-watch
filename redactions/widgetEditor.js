/**
 * CONSTANTS
*/
const ADD_FILTER = 'widgetEditor/ADD_FILTER';
const REMOVE_FILTER = 'widgetEditor/REMOVE_FILTER';
const SET_COLOR = 'widgetEditor/SET_COLOR';
const REMOVE_COLOR = 'widgetEditor/REMOVE_COLOR';
const SET_SIZE = 'widgetEditor/SET_SIZE';
const REMOVE_SIZE = 'widgetEditor/REMOVE_SIZE';
const SET_DIMENSION_X = 'widgetEditor/SET_DIMENSION_X';
const REMOVE_DIMENSION_X = 'widgetEditor/REMOVE_DIMENSION_X';
const SET_DIMENSION_Y = 'widgetEditor/SET_DIMENSION_Y';
const REMOVE_DIMENSION_Y = 'widgetEditor/REMOVE_DIMENSION_Y';

/**
 * REDUCER
*/
const initialState = {
  filters: [],
  color: null,
  size: null,
  dimensionX: null,
  dimensionY: null
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

    case SET_COLOR: {
      return Object.assign({}, state, {
        color: action.payload
      });
    }

    case REMOVE_COLOR: {
      return Object.assign({}, state, {
        color: null
      });
    }

    case SET_SIZE: {
      return Object.assign({}, state, {
        size: action.payload
      });
    }

    case REMOVE_SIZE: {
      return Object.assign({}, state, {
        size: null
      });
    }

    case SET_DIMENSION_X: {
      return Object.assign({}, state, {
        dimensionX: action.payload
      });
    }

    case REMOVE_DIMENSION_X: {
      return Object.assign({}, state, {
        dimensionX: null
      });
    }

    case SET_DIMENSION_Y: {
      return Object.assign({}, state, {
        dimensionY: action.payload
      });
    }

    case REMOVE_DIMENSION_Y: {
      return Object.assign({}, state, {
        dimensionY: null
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
 * - setColor
 * - removeColor
 * - setSize
 * - removeSize
 * - setDimensionX
 * - removeDimensionX
 * - setDimensionY
 * - removeDimensionY
*/
export function addFilter(filter) {
  return dispatch => dispatch({ type: ADD_FILTER, payload: filter });
}
export function removeFilter(filter) {
  return dispatch => dispatch({ type: REMOVE_FILTER, payload: filter });
}
export function setColor(color) {
  return dispatch => dispatch({ type: SET_COLOR, payload: color });
}
export function removeColor(color) {
  return dispatch => dispatch({ type: REMOVE_COLOR, payload: color });
}
export function setSize(size) {
  return dispatch => dispatch({ type: SET_SIZE, payload: size });
}
export function removeSize(size) {
  return dispatch => dispatch({ type: REMOVE_SIZE, payload: size });
}
export function setDimensionX(dimensionX) {
  return dispatch => dispatch({ type: SET_DIMENSION_X, payload: dimensionX });
}
export function removeDimensionX(dimensionX) {
  return dispatch => dispatch({ type: REMOVE_DIMENSION_X, payload: dimensionX });
}
export function setDimensionY(dimensionY) {
  return dispatch => dispatch({ type: SET_DIMENSION_Y, payload: dimensionY });
}
export function removeDimensionY(dimensionY) {
  return dispatch => dispatch({ type: REMOVE_DIMENSION_Y, payload: dimensionY });
}
