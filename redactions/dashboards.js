import { USER_TYPES } from 'components/admin/table-filters/constants';
/**
 * CONSTANTS
*/
const GET_DASHBOARDS_SUCCESS = 'explore/GET_DASHBOARDS_SUCCESS';
const GET_DASHBOARDS_ERROR = 'explore/GET_DASHBOARDS_ERROR';
const GET_DASHBOARDS_LOADING = 'explore/GET_DASHBOARDS_LOADING';
const SET_DASHBOARDS_FILTERS = 'dashboards/SET_DASHBOARDS_FILTERS';

/**
 * STORE
 * @property {string} dashboards.error
 * @property {{ key: string, value: string|number }[]} dashboards.filters
 */
const initialState = {
  list: [], // Actual list of dashboards
  loading: false, // Are we loading the data?
  error: null, // An error was produced while loading the data
  filters: [{ key: 'owner', value: USER_TYPES.ADMIN }], // Filters for the list of dashboards
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_DASHBOARDS_SUCCESS: {
      return {
        ...state,
        list: action.payload,
        loading: false,
        error: null,
      };
    }

    case GET_DASHBOARDS_ERROR: {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    }

    case GET_DASHBOARDS_LOADING: {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }

    case SET_DASHBOARDS_FILTERS: {
      return { ...state, filters: action.payload };
    }

    default:
      return state;
  }
}

/**
 * Set the filters for the list of dashboards
 * @export
 * @param {{ key: string, value: string|number }[]} filters List of filters
 */
export function setFilters(filters) {
  return (dispatch) => dispatch({
    type: SET_DASHBOARDS_FILTERS,
    payload: filters,
  });
}
