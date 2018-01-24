import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';
import WidgetsService from 'services/WidgetsService';

/**
 * CONSTANTS
*/
const GET_WIDGETS_SUCCESS = 'widgets/GET_WIDGETS_SUCCESS';
const GET_WIDGETS_ERROR = 'widgets/GET_WIDGETS_ERROR';
const GET_WIDGETS_LOADING = 'widgets/GET_WIDGETS_LOADING';
const SET_WIDGETS_FILTERS = 'widgets/SET_WIDGETS_FILTERS';
const SET_WIDGETS_ORDER_DIRECTION = 'widgets/setOrderDirection';

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
    filters: [], // Filters for the list of widgets,
    orderDirection: 'desc' // sort's direction of the list
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

    case SET_WIDGETS_ORDER_DIRECTION: {
      return { ...state, widgets: { ...state.widgets, orderDirection: action.payload } };
    }

    default:
      return state;
  }
}

export const setFilters = createAction(SET_WIDGETS_FILTERS);
export const setOrderDirection = createAction(SET_WIDGETS_ORDER_DIRECTION);

/**
 * Retrieve the list of widgets
 * @export
 * @param {string[]} applications Name of the applications to load the widgets from
 */
export const getWidgets = createThunkAction('widgets/getWidgets', options =>
  (dispatch) => {
    dispatch({ type: GET_WIDGETS_LOADING });

    return service.fetchAllData({ includes: 'widget', ...options })
      .then((data) => {
        dispatch({ type: GET_WIDGETS_SUCCESS, payload: data });
      })
      .catch((err) => {
        dispatch({ type: GET_WIDGETS_ERROR, payload: err.message });
      });
  });

export const getWidgetsByTab = createThunkAction('widgets/getWidgetsByTab', tab =>
  (dispatch, getState) => {
    let options = {};
    const { user, widgets } = getState();
    const { id } = user;
    const { orderDirection } = widgets.widgets;

    if (tab === 'my_widgets') {
      options = {
        env: process.env.API_ENV,
        application: [process.env.APPLICATIONS],
        filters: {
          userId: id,
          sort: (orderDirection === 'asc') ? 'updatedAt' : '-updatedAt'
        }
      };
    }

    dispatch(getWidgets({ ...options }));
  });
