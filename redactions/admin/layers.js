import 'isomorphic-fetch';

// Services
import LayersService from 'services/LayersService';

/**
 * CONSTANTS
*/
const GET_LAYERS_SUCCESS = 'layers/GET_LAYERS_SUCCESS';
const GET_LAYERS_ERROR = 'layers/GET_LAYERS_ERROR';
const GET_LAYERS_LOADING = 'layers/GET_LAYERS_LOADING';
const SET_LAYERS_FILTERS = 'layers/SET_LAYERS_FILTERS';

const service = new LayersService();

/**
 * STORE
 * @property {string} layers.error
 * @property {{ key: string, value: string|number }[]} layers.filters
 */
const initialState = {
  layers: {
    list: [], // Actual list of layers
    loading: false, // Are we loading the data?
    error: null, // An error was produced while loading the data
    filters: [] // Filters for the list of layers
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
    case GET_LAYERS_LOADING: {
      const layers = Object.assign({}, state.layers, {
        loading: true,
        error: null
      });
      return Object.assign({}, state, { layers });
    }

    case GET_LAYERS_SUCCESS: {
      const layers = Object.assign({}, state.layers, {
        list: action.payload,
        loading: false,
        error: null
      });
      return Object.assign({}, state, { layers });
    }

    case GET_LAYERS_ERROR: {
      const layers = Object.assign({}, state.layers, {
        loading: false,
        error: action.payload
      });
      return Object.assign({}, state, { layers });
    }

    case SET_LAYERS_FILTERS: {
      const layers = Object.assign({}, state.layers, { filters: action.payload });
      return Object.assign({}, state, { layers });
    }

    default:
      return state;
  }
}

/**
 * ACTIONS
 */

/**
 * Retrieve the list of layers
 * @export
 * @param {string[]} applications Name of the applications to load the layers from
 */
export function getLayers({ applications = [process.env.APPLICATIONS], dataset }) {
  return (dispatch) => {
    dispatch({ type: GET_LAYERS_LOADING });

    service.fetchAllData({ applications, dataset })
      .then((data) => {
        dispatch({ type: GET_LAYERS_SUCCESS, payload: data });
      })
      .catch(err => dispatch({ type: GET_LAYERS_ERROR, payload: err.message }));
  };
}

/**
 * Set the filters for the list of layers
 * @export
 * @param {{ key: string, value: string|number }[]} filters List of filters
 */
export function setFilters(filters) {
  return dispatch => dispatch({
    type: SET_LAYERS_FILTERS,
    payload: filters
  });
}
