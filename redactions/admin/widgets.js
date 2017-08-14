import 'isomorphic-fetch';
import WidgetsService from 'services/WidgetsService';

/**
 * CONSTANTS
*/
const GET_WIDGETS_SUCCESS = 'widgets/GET_WIDGETS_SUCCESS';
const GET_WIDGETS_ERROR = 'widgets/GET_WIDGETS_ERROR';
const GET_WIDGETS_LOADING = 'widgets/GET_WIDGETS_LOADING';
const SET_WIDGETS_FILTERS = 'widgets/SET_WIDGETS_FILTERS';

/**
 * STORE
 * @property {string} widgets.error
 * @property {{ key: string, value: string|number }[]} widgets.filters
 */
const initialState = {
  widgets: {
    list: [], // Actual list of widgets
    loading: false, // Are we loading the data?
    error: null, // An error was produced while loading the data
    filters: [] // Filters for the list of widgets
  }
};

const service = new WidgetsService();
/**
 * REDUCER
 * @export
 * @param {initialState} state
 * @param {{ type: string, payload: any }} action
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_WIDGETS_LOADING: {
      const widgets = Object.assign({}, state.widgets, {
        loading: true,
        error: null
      });
      return Object.assign({}, state, { widgets });
    }

    case GET_WIDGETS_SUCCESS: {
      const widgets = Object.assign({}, state.widgets, {
        list: action.payload,
        loading: false,
        error: null
      });
      return Object.assign({}, state, { widgets });
    }

    case GET_WIDGETS_ERROR: {
      const widgets = Object.assign({}, state.widgets, {
        loading: false,
        error: action.payload
      });
      return Object.assign({}, state, { widgets });
    }

    case SET_WIDGETS_FILTERS: {
      const widgets = Object.assign({}, state.widgets, { filters: action.payload });
      return Object.assign({}, state, { widgets });
    }

    default:
      return state;
  }
}

/**
 * ACTIONS
 */

/**
 * Retrieve the list of widgets
 * @export
 * @param {string[]} applications Name of the applications to load the widgets from
 */
export function getWidgets() {
  return (dispatch) => {
    dispatch({ type: GET_WIDGETS_LOADING });

    service.fetchAllData({})
      .then((data) => {
        dispatch({ type: GET_WIDGETS_SUCCESS, payload: data });
      })
      .catch((err) => {
        dispatch({ type: GET_WIDGETS_ERROR, payload: err.message });
      });
  };
}

/**
 * Set the filters for the list of widgets
 * @export
 * @param {{ key: string, value: string|number }[]} filters List of filters
 */
export function setFilters(filters) {
  return dispatch => dispatch({
    type: SET_WIDGETS_FILTERS,
    payload: filters
  });
}
