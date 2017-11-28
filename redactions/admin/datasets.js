import 'isomorphic-fetch';
import DatasetsService from 'services/DatasetsService';

/**
 * CONSTANTS
*/
const GET_DATASETS_SUCCESS = 'datasets/GET_DATASETS_SUCCESS';
const GET_DATASETS_ERROR = 'datasets/GET_DATASETS_ERROR';
const GET_DATASETS_LOADING = 'datasets/GET_DATASETS_LOADING';
const SET_DATASETS_FILTERS = 'datasets/SET_DATASETS_FILTERS';

/**
 * STORE
 * @property {string} datasets.error
 * @property {{ key: string, value: string|number }[]} datasets.filters
 */
const initialState = {
  datasets: {
    list: [], // Actual list of datasets
    loading: false, // Are we loading the data?
    error: null, // An error was produced while loading the data
    filters: [] // Filters for the list of datasets
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
    case GET_DATASETS_LOADING: {
      const datasets = Object.assign({}, state.datasets, {
        loading: true,
        error: null
      });
      return Object.assign({}, state, { datasets });
    }

    case GET_DATASETS_SUCCESS: {
      const datasets = Object.assign({}, state.datasets, {
        list: action.payload,
        loading: false,
        error: null
      });
      return Object.assign({}, state, { datasets });
    }

    case GET_DATASETS_ERROR: {
      const datasets = Object.assign({}, state.datasets, {
        loading: false,
        error: action.payload
      });
      return Object.assign({}, state, { datasets });
    }

    case SET_DATASETS_FILTERS: {
      const datasets = Object.assign({}, state.datasets, { filters: action.payload });
      return Object.assign({}, state, { datasets });
    }

    default:
      return state;
  }
}

/**
 * ACTIONS
 */

/**
 * Retrieve the list of datasets
 * @export
 * @param {string[]} applications Name of the applications to load the datasets from
 */
export function getDatasets(options) {
  return (dispatch, getState) => {
    dispatch({ type: GET_DATASETS_LOADING });

    const state = getState();

    const service = new DatasetsService({
      language: state.common.locale
    });

    service.fetchAdminData(options)
      .then((data) => {
        dispatch({ type: GET_DATASETS_SUCCESS, payload: data });
      })
      .catch((err) => {
        dispatch({ type: GET_DATASETS_ERROR, payload: err.message });
      });
  };
}

/**
 * Set the filters for the list of datasets
 * @export
 * @param {{ key: string, value: string|number }[]} filters List of filters
 */
export function setFilters(filters) {
  return dispatch => dispatch({
    type: SET_DATASETS_FILTERS,
    payload: filters
  });
}
