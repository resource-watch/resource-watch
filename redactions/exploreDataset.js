import DatasetService from 'services/DatasetService';

/**
 * CONSTANTS
*/
const GET_EXPLORE_DATASET_SUCCESS = 'datasets/GET_EXPLORE_DATASET_SUCCESS';
const GET_EXPLORE_DATASET_ERROR = 'datasets/GET_EXPLORE_DATASET_ERROR';
const GET_EXPLORE_DATASET_LOADING = 'datasets/GET_EXPLORE_DATASET_LOADING';

/**
 * STORE
 * @property {string} datasets.error
 * @property {{ key: string, value: string|number }[]} datasets.filters
 */
const initialState = {
  data: {}, // Actual list of datasets
  loading: false, // Are we loading the data?
  error: null // An error was produced while loading the data
};

/**
 * REDUCER
 * @export
 * @param {initialState} state
 * @param {{ type: string, payload: any }} action
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_EXPLORE_DATASET_LOADING: {
      const datasets = Object.assign({}, state.datasets, {
        loading: true,
        error: null
      });
      return Object.assign({}, state, datasets);
    }

    case GET_EXPLORE_DATASET_SUCCESS: {
      const datasets = Object.assign({}, state.datasets, {
        data: action.payload,
        loading: false,
        error: null
      });
      return Object.assign({}, state, datasets);
    }

    case GET_EXPLORE_DATASET_ERROR: {
      const datasets = Object.assign({}, state.datasets, {
        loading: false,
        error: action.payload
      });
      return Object.assign({}, state, datasets);
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
export function getDataset(datasetId) {
  const service = new DatasetService(datasetId, {
    apiURL: process.env.WRI_API_URL
  });

  return (dispatch) => {
    dispatch({ type: GET_EXPLORE_DATASET_LOADING });

    return service.fetchData('metadata,widget')
      .then((data) => {
        console.log(data);
        dispatch({ type: GET_EXPLORE_DATASET_SUCCESS, payload: data });
      })
      .catch((err) => {
        dispatch({ type: GET_EXPLORE_DATASET_ERROR, payload: err.message });
      });
  };
}
