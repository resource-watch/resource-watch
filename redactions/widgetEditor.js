/**
 * CONSTANTS
*/
const ADD_FILTER = 'widgetEditor/ADD_FILTER';
const REMOVE_FILTER = 'widgetEditor/REMOVE_FILTER';

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
      console.log('filters', filters);
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
*/
export function addFilter(filter) {
  return dispatch => dispatch({ type: ADD_FILTER, payload: filter });
}
export function removeFilter(filter) {
  return dispatch => dispatch({ type: REMOVE_FILTER, payload: filter });
}
