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
const SET_WIDGETS_PAGINATION_PAGE = 'widgets/setWidgetsPaginationPage';
const SET_WIDGETS_PAGINATION_TOTAL = 'widgets/setWidgetsPaginationTotal';
const SET_WIDGETS_PAGINATION_LIMIT = 'widgets/setWidgetsPaginationLimit';


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
    orderDirection: 'desc', // sort's direction of the list
    pagination: {
      page: 1, // current page of the pagination
      total: 0, // total items to be paginated
      limit: 9 // size of the pagination
    }
  }
};

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

    case SET_WIDGETS_PAGINATION_PAGE: {
      return {
        ...state,
        widgets: {
          ...state.widgets,
          pagination: {
            ...state.widgets.pagination,
            page: action.payload
          }
        }
      };
    }

    case SET_WIDGETS_PAGINATION_TOTAL: {
      return {
        ...state,
        widgets: {
          ...state.widgets,
          pagination: {
            ...state.widgets.pagination,
            total: action.payload
          }
        }
      };
    }

    case SET_WIDGETS_PAGINATION_LIMIT: {
      return {
        ...state,
        widgets: {
          ...state.widgets,
          pagination: {
            ...state.widgets.pagination,
            limit: action.payload
          }
        }
      };
    }

    default:
      return state;
  }
}

export const setFilters = createAction(SET_WIDGETS_FILTERS);
export const setOrderDirection = createAction(SET_WIDGETS_ORDER_DIRECTION);
export const setPaginationPage = createAction(SET_WIDGETS_PAGINATION_PAGE);
export const setPaginationTotal = createAction(SET_WIDGETS_PAGINATION_TOTAL);
export const setPaginationLimit = createAction(SET_WIDGETS_PAGINATION_LIMIT);

/**
 * Retrieve the list of widgets
 * @export
 * @param {string[]} applications Name of the applications to load the widgets from
 */
export const getWidgets = createThunkAction('widgets/getWidgets', options =>
  (dispatch, getState) => {
    dispatch({ type: GET_WIDGETS_LOADING });
    const { user } = getState();

    return WidgetsService.getAllWidgets(user.token, { ...options })
      .then(({ data, meta }) => {
        const { 'total-items': totalItems } = meta;
        dispatch({
          type: GET_WIDGETS_SUCCESS,
          payload: data.map(d => ({ ...{ id: d.id, type: d.type }, ...d.attributes }))
        });
        dispatch(setPaginationTotal(totalItems));
      })
      .catch((err) => {
        dispatch({ type: GET_WIDGETS_ERROR, payload: err.message });
      });
  });

export const getWidgetsByTab = createThunkAction('widgets/getWidgetsByTab', tab =>
  (dispatch, getState) => {
    const { user, widgets } = getState();
    const { id } = user;
    const { orderDirection, pagination, filters } = widgets.widgets;
    const { page, limit } = pagination;
    let options = {
      filters: {
        'page[size]': limit,
        'page[number]': page,
        sort: (orderDirection === 'asc') ? 'updatedAt' : '-updatedAt',
        name: (filters.find(filter => filter.key === 'name') || {}).value
      }
    };

    switch (tab) {
      // when the user asks for a its own widgets...
      case 'my_widgets':
        options = { ...options,
          filters: {
            ...options.filters,
            userId: id
          }
        };

        break;

      // when the user asks for its favourites widgets...
      case 'favourites':
        options = { ...options,
          filters: {
            ...options.filters,
            favourites: true
          }
        };
        break;

      // when the user asks for a specific collection...
      default:
        options = {
          ...options,
          filters: {
            ...options.filters,
            collection: tab
          }
        };
    }

    dispatch(getWidgets({ ...options }));
  });
