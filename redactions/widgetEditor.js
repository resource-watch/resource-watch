/**
 * CONSTANTS
*/
const ADD_FILTER = 'widgetEditor/ADD_FILTER';

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
      filters.push(action.payload);
      console.log(filters);
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
*/
export function addFilter(filter) {
  return dispatch => dispatch({ type: ADD_FILTER, payload: filter });
}
