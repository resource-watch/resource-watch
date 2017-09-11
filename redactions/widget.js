import 'isomorphic-fetch';
import WidgetService from 'services/WidgetService';

/**
 * CONSTANTS
*/
const GET_WIDGET_SUCCESS = 'GET_WIDGET_SUCCESS';
const GET_WIDGET_ERROR = 'GET_WIDGET_ERROR';
const GET_WIDGET_LOADING = 'GET_WIDGET_LOADING';

/**
 * STORE
 */
const initialState = {
  data: {}, // Actual list of widgets
  loading: false, // Are we loading the data?
  error: null // An error was produced while loading the data
};

/**
 * REDUCER
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_WIDGET_LOADING: {
      const widgets = {
        loading: true,
        error: null
      };
      return Object.assign({}, state, widgets);
    }

    case GET_WIDGET_SUCCESS: {
      const widgets = {
        data: action.payload,
        loading: false,
        error: null
      };
      return Object.assign({}, state, widgets);
    }

    case GET_WIDGET_ERROR: {
      const widgets = {
        loading: false,
        error: action.payload
      };
      return Object.assign({}, state, widgets);
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
 */
export function getWidget(widgetId) {
  return (dispatch) => {
    dispatch({ type: GET_WIDGET_LOADING });
    const service = new WidgetService(widgetId, { apiURL: process.env.WRI_API_URL });
    return service.fetchData()
      .then((data) => {
        dispatch({ type: GET_WIDGET_SUCCESS, payload: data });
      })
      .catch((err) => {
        dispatch({ type: GET_WIDGET_ERROR, payload: err.message });
      });
  };
}
