/**
 * CONSTANTS
*/
const RESET_DATASET = 'explore/RESET_DATASET';
const TOGGLE_LAYER_SHOWN = 'explore/TOGGLE_LAYER_SHOWN';

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
    case RESET_DATASET: {
      return initialState;
    }

    case TOGGLE_LAYER_SHOWN: {
      const dataset = Object.assign({}, state.dataset, {
        layersShownIds: action.payload
      });

      return Object.assign({}, state, { dataset });
    }

    default:
      return state;
  }
}

/**
 * ACTIONS
 * - resetDataset
 * - toggleLayerShown
*/

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
