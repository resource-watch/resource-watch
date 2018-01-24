import 'isomorphic-fetch';

// Services
import DatasetService from 'services/DatasetService';

/**
 * CONSTANTS
*/
const GET_SIMILAR_DATASETS_SUCCESS = 'GET_SIMILAR_DATASETS_SUCCESS';
const GET_SIMILAR_DATASETS_ERROR = 'GET_SIMILAR_DATASETS_ERROR';
const GET_SIMILAR_DATASETS_LOADING = 'GET_SIMILAR_DATASETS_LOADING';
const SET_SIMILAR_DATASETS = 'SET_SIMILAR_DATASETS';

/**
 * STORE
 */
const initialState = {
  data: [], // Similar datasets
  loading: true, // Are we loading the data?
  error: null // An error was produced while loading the data
};

/**
 * REDUCER
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_SIMILAR_DATASETS_LOADING: {
      const similarDatasets = {
        loading: true,
        error: null
      };
      return Object.assign({}, state.similarDatasets, similarDatasets);
    }

    case GET_SIMILAR_DATASETS_SUCCESS: {
      const similarDatasets = {
        loading: false,
        error: null
      };
      return Object.assign({}, state.similarDatasets, similarDatasets);
    }

    case GET_SIMILAR_DATASETS_ERROR: {
      const similarDatasets = {
        loading: false,
        error: action.payload
      };
      return Object.assign({}, state.similarDatasets, similarDatasets);
    }

    case SET_SIMILAR_DATASETS: {
      const similarDatasets = {
        data: action.payload
      };
      return Object.assign({}, state.similarDatasets, similarDatasets);
    }

    default:
      return state;
  }
}

/**
 * ACTIONS
 */

/**
 * Retrieve the set of datasets that are similar to the one provided
 * @param {string} datasetId
 */
export function getSimilarDatasets(datasetId) {
  return (dispatch) => {
    dispatch({ type: GET_SIMILAR_DATASETS_LOADING });
    const service = new DatasetService(datasetId, { apiURL: process.env.WRI_API_URL });
    return service.getSimilarDatasets()
      .then((data) => {
        dispatch({ type: SET_SIMILAR_DATASETS, payload: data });
        return data;
      })
      .then(() => dispatch({ type: GET_SIMILAR_DATASETS_SUCCESS }))
      .catch((err) => {
        dispatch({ type: GET_SIMILAR_DATASETS_ERROR, payload: err.message });
      });
  };
}
