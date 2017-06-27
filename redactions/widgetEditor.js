/**
 * CONSTANTS
*/
const ADD_FILTER = 'widgetEditor/ADD_FILTER';
const SET_FILTER_VALUE = 'widgetEditor/SET_FILTER_VALUE';
const REMOVE_FILTER = 'widgetEditor/REMOVE_FILTER';
const SET_COLOR = 'widgetEditor/SET_COLOR';
const REMOVE_COLOR = 'widgetEditor/REMOVE_COLOR';
const SET_SIZE = 'widgetEditor/SET_SIZE';
const REMOVE_SIZE = 'widgetEditor/REMOVE_SIZE';
const SET_CATEGORY = 'widgetEditor/SET_CATEGORY';
const REMOVE_CATEGORY = 'widgetEditor/REMOVE_CATEGORY';
const SET_VALUE = 'widgetEditor/SET_VALUE';
const REMOVE_VALUE = 'widgetEditor/REMOVE_VALUE';
const SET_CHART_TYPE = 'widgetEditor/SET_CHART_TYPE';
const RESET = 'widgetEditor/RESET';

/**
 * REDUCER
*/
const initialState = {
  filters: [],
  color: null,
  size: null,
  category: null,
  value: null
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

    case SET_FILTER_VALUE: {
      const index = state.filters.findIndex(f => f.name === action.payload.name);
      const filters = state.filters.map((filter, i) => {
        if (i !== index) return filter;
        return Object.assign({}, filter, {
          value: action.payload.value
        });
      });
      return Object.assign({}, state, { filters });
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

    case SET_CATEGORY: {
      return Object.assign({}, state, {
        category: action.payload
      });
    }

    case REMOVE_CATEGORY: {
      return Object.assign({}, state, {
        category: null
      });
    }

    case SET_VALUE: {
      return Object.assign({}, state, {
        value: action.payload
      });
    }

    case REMOVE_VALUE: {
      return Object.assign({}, state, {
        value: null
      });
    }

    case SET_CHART_TYPE: {
      return Object.assign({}, state, {
        chartType: action.payload
      });
    }

    case RESET: {
      return Object.assign({}, initialState);
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
 * - setCategory
 * - removeCategory
 * - setValue
 * - removeValue
*/
export function addFilter(filter) {
  return dispatch => dispatch({ type: ADD_FILTER, payload: filter });
}
export function setFilterValue(name, value) {
  return dispatch => dispatch({ type: SET_FILTER_VALUE, payload: { name, value } });
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
export function setCategory(category) {
  return dispatch => dispatch({ type: SET_CATEGORY, payload: category });
}
export function removeCategory(category) {
  return dispatch => dispatch({ type: REMOVE_CATEGORY, payload: category });
}
export function setValue(value) {
  return dispatch => dispatch({ type: SET_VALUE, payload: value });
}
export function removeValue(value) {
  return dispatch => dispatch({ type: REMOVE_VALUE, payload: value });
}
export function setChartType(type) {
  return dispatch => dispatch({ type: SET_CHART_TYPE, payload: type });
}
export function resetWidgetEditor() {
  return dispatch => dispatch({ type: RESET });
}
