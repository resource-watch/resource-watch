/**
 * CONSTANTS
*/
const GET_DATASET_SUCCESS = 'explore/GET_DATASET_SUCCESS';
const GET_DATASET_ERROR = 'explore/GET_DATASET_ERROR';
const GET_DATASET_LOADING = 'explore/GET_DATASET_LOADING';
const RESET_DATASET = 'explore/RESET_DATASET';
const TOGGLE_LAYER_SHOWN = 'explore/TOGGLE_LAYER_SHOWN';
const GET_SIMILAR_DATASETS_SUCCESS = 'explore/GET_SIMILAR_DATASETS_SUCCESS';
const GET_SIMILAR_DATASETS_ERROR = 'explore/GET_SIMILAR_DATASETS_ERROR';
const GET_SIMILAR_DATASETS_LOADING = 'explore/GET_SIMILAR_DATASETS_LOADING';

/**
 * REDUCER
*/
const initialState = {
  dataset: {
    detail: {
      attributes: {
        layer: []
      }
    },
    loading: false,
    error: false,
    layersShownIds: [],
    layersShown: []
  },
  similarDatasets: {
    loading: false,
    error: false,
    list: []
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_DATASET_SUCCESS: {
      const dataset = Object.assign({}, state.dataset, {
        detail: action.payload,
        loading: false,
        error: false
      });
      return Object.assign({}, state, { dataset });
    }

    case GET_DATASET_ERROR: {
      const dataset = Object.assign({}, state.dataset, {
        loading: false,
        error: true
      });
      return Object.assign({}, state, { dataset });
    }

    case GET_DATASET_LOADING: {
      const dataset = Object.assign({}, state.dataset, {
        loading: true,
        error: false
      });
      return Object.assign({}, state, { dataset });
    }

    case RESET_DATASET: {
      return initialState;
    }

    case TOGGLE_LAYER_SHOWN: {
      const dataset = Object.assign({}, state.dataset, {
        layersShownIds: action.payload
      });

      return Object.assign({}, state, { dataset });
    }

    case GET_SIMILAR_DATASETS_SUCCESS: {
      const similarDatasets = Object.assign({}, state.similarDatasets, {
        list: action.payload,
        loading: false,
        error: false
      });
      return Object.assign({}, state, { similarDatasets });
    }

    case GET_SIMILAR_DATASETS_ERROR: {
      const similarDatasets = Object.assign({}, state.similarDatasets, {
        loading: false,
        error: true
      });
      return Object.assign({}, state, { similarDatasets });
    }

    case GET_SIMILAR_DATASETS_LOADING: {
      const similarDatasets = Object.assign({}, state.similarDatasets, {
        loading: true,
        error: false
      });
      return Object.assign({}, state, { similarDatasets });
    }

    default:
      return state;
  }
}

/**
 * ACTIONS
 * - getDataset
 * - getSimilarDatasets
 * - resetDataset
 * - toggleLayerShown
*/
export function getDataset(datasetId) {
  return (dispatch) => {
    console.info(datasetId);
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_DATASET_LOADING });
    // TODO: remove the date now
    fetch(new Request(`${config.API_URL}/dataset/${datasetId}?application=rw&includes=widget,layer,metadata,vocabulary&page[size]=${Date.now() / 100000}`))
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((response) => {
        const dataset = response.data;

        dispatch({
          type: GET_DATASET_SUCCESS,
          payload: dataset
        });
      })
      .catch((err) => {
        // Fetch from server ko -> Dispatch error
        dispatch({
          type: GET_DATASET_ERROR,
          payload: err.message
        });
      });
  };
}

export function getSimilarDatasets(tags){
  return (dispatch) => {
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_SIMILAR_DATASETS_LOADING });
    // TODO: remove the date now
    fetch(new Request(`${config.API_URL}/dataset?application=rw&status=saved&includes=widget,layer,vocabulary&vocabulary[legacy]=${tags}&page[size]=4&page[number]=1&cache=${Date.now() / 100000}`))
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((response) => {
        const datasets = response.data;

        dispatch({
          type: GET_SIMILAR_DATASETS_SUCCESS,
          payload: datasets
        });
      })
      .catch((err) => {
        // Fetch from server ko -> Dispatch error
        dispatch({
          type: GET_SIMILAR_DATASETS_ERROR,
          payload: err.message
        });
      });
  };
}

export function resetDataset() {
  return {
    type: RESET_DATASET
  };
}

export function toggleLayerShown(id) {
  return (dispatch, getState) => {
    const { exploreDetail } = getState();
    const layersShownIds = exploreDetail.dataset.layersShownIds.slice();
    const index = layersShownIds.indexOf(id);

    // Toggle the layer shown
    if (index !== -1) {
      layersShownIds.splice(index, 1);
    } else {
      layersShownIds.push(id);
    }

    dispatch({
      type: TOGGLE_LAYER_SHOWN,
      payload: layersShownIds
    });
  };
}

// Let's use {replace} instead of {push}, that's how we will allow users to
// go away from the current page
// export function setUrlParams() {
//   return (dispatch, state) => {
//     const { explore } = state();
//     const { active, page } = explore.dataset;
//     const locationDescriptor = {
//       pathname: '/explore',
//       query: {
//         active: active.length ? active.join(',') : undefined,
//         page
//       }
//     };
//     dispatch(replace(locationDescriptor));
//   };
// }
