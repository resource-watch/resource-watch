import DatasetService from 'services/DatasetService';
import GraphService from 'services/GraphService';

import { TAGS_BLACKLIST } from 'utils/graph/TagsUtil';

/**
 * CONSTANTS
*/
// DATASET
const GET_EXPLORE_DATASET_SUCCESS = 'datasets/GET_EXPLORE_DATASET_SUCCESS';
const GET_EXPLORE_DATASET_ERROR = 'datasets/GET_EXPLORE_DATASET_ERROR';
const GET_EXPLORE_DATASET_LOADING = 'datasets/GET_EXPLORE_DATASET_LOADING';

// PARTNER
const GET_EXPLORE_DATASET_PARTNER_SUCCESS = 'datasets/GET_EXPLORE_DATASET_PARTNER_SUCCESS';
const GET_EXPLORE_DATASET_PARTNER_ERROR = 'datasets/GET_EXPLORE_DATASET_PARTNER_ERROR';
const GET_EXPLORE_DATASET_PARTNER_LOADING = 'datasets/GET_EXPLORE_DATASET_PARTNER_LOADING';

// TOOLS
const SET_EXPLORE_DATASET_TOOLS = 'datasets/SET_EXPLORE_DATASET_TOOLS';
const GET_EXPLORE_DATASET_TOOLS_SUCCESS = 'datasets/GET_EXPLORE_DATASET_TOOLS_SUCCESS';
const GET_EXPLORE_DATASET_TOOLS_ERROR = 'datasets/GET_EXPLORE_DATASET_TOOLS_ERROR';
const GET_EXPLORE_DATASET_TOOLS_LOADING = 'datasets/GET_EXPLORE_DATASET_TOOLS_LOADING';

// TAGS
const SET_EXPLORE_DATASET_TAGS = 'datasets/SET_EXPLORE_DATASET_TAGS';
const GET_EXPLORE_DATASET_TAGS_SUCCESS = 'datasets/GET_EXPLORE_DATASET_TAGS_SUCCESS';
const GET_EXPLORE_DATASET_TAGS_ERROR = 'datasets/GET_EXPLORE_DATASET_TAGS_ERROR';
const GET_EXPLORE_DATASET_TAGS_LOADING = 'datasets/GET_EXPLORE_DATASET_TAGS_LOADING';

// COUNT VIEW
const SET_EXPLORE_DATASET_COUNT_VIEW = 'datasets/SET_EXPLORE_DATASET_COUNT_VIEW';

/**
 * STORE
 * @property {string} datasets.error
 * @property {{ key: string, value: string|number }[]} datasets.filters
 */
const initialState = {
  data: {}, // Actual list of datasets
  loading: false, // Are we loading the data?
  error: null, // An error was produced while loading the data
  partner: {
    data: {},
    loading: true,
    error: null
  },
  tools: {
    list: [],
    active: [],
    loading: true,
    error: null
  },
  tags: {
    list: [],
    active: [],
    loading: true,
    error: null
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
    // DATASET
    case GET_EXPLORE_DATASET_LOADING: {
      const exploreDataset = Object.assign({}, state, {
        loading: true,
        error: null
      });
      return Object.assign({}, state, exploreDataset);
    }

    case GET_EXPLORE_DATASET_SUCCESS: {
      const exploreDataset = Object.assign({}, state, {
        data: action.payload,
        loading: false,
        error: null
      });
      return Object.assign({}, state, exploreDataset);
    }

    case GET_EXPLORE_DATASET_ERROR: {
      const exploreDataset = Object.assign({}, state, {
        loading: false,
        error: action.payload
      });
      return Object.assign({}, state, exploreDataset);
    }


    // PARTNER
    case GET_EXPLORE_DATASET_PARTNER_SUCCESS: {
      const partner = Object.assign({}, state.partner, {
        data: action.payload,
        loading: false,
        error: null
      });

      const exploreDataset = Object.assign({}, state, {
        partner
      });

      return Object.assign({}, state, exploreDataset);
    }

    case GET_EXPLORE_DATASET_PARTNER_LOADING: {
      const partner = Object.assign({}, state.partner, {
        loading: true,
        error: null
      });

      const exploreDataset = Object.assign({}, state, {
        partner
      });

      return Object.assign({}, state, exploreDataset);
    }

    case GET_EXPLORE_DATASET_PARTNER_ERROR: {
      const partner = Object.assign({}, state.partner, {
        loading: false,
        error: action.payload
      });

      const exploreDataset = Object.assign({}, state, {
        partner
      });

      return Object.assign({}, state, exploreDataset);
    }


    // Tools
    case SET_EXPLORE_DATASET_TOOLS: {
      const tools = Object.assign({}, state.tools, {
        active: action.payload
      });

      const exploreDataset = Object.assign({}, state, {
        tools
      });

      return Object.assign({}, state, exploreDataset);
    }

    case GET_EXPLORE_DATASET_TOOLS_LOADING: {
      const tools = Object.assign({}, state.tools, {
        loading: true,
        error: null
      });

      const exploreDataset = Object.assign({}, state, {
        tools
      });

      return Object.assign({}, state, exploreDataset);
    }

    case GET_EXPLORE_DATASET_TOOLS_SUCCESS: {
      const tools = Object.assign({}, state.tools, {
        list: action.payload,
        loading: false,
        error: null
      });

      const exploreDataset = Object.assign({}, state, {
        tools
      });

      return Object.assign({}, state, exploreDataset);
    }

    case GET_EXPLORE_DATASET_TOOLS_ERROR: {
      const tools = Object.assign({}, state.tools, {
        loading: false,
        error: action.payload
      });

      const exploreDataset = Object.assign({}, state, {
        tools
      });

      return Object.assign({}, state, exploreDataset);
    }


    // Tools
    case SET_EXPLORE_DATASET_TAGS: {
      const tags = Object.assign({}, state.tags, {
        active: action.payload
      });

      const exploreDataset = Object.assign({}, state, {
        tags
      });

      return Object.assign({}, state, exploreDataset);
    }

    case GET_EXPLORE_DATASET_TAGS_LOADING: {
      const tags = Object.assign({}, state.tags, {
        loading: true,
        error: null
      });

      const exploreDataset = Object.assign({}, state, {
        tags
      });

      return Object.assign({}, state, exploreDataset);
    }

    case GET_EXPLORE_DATASET_TAGS_SUCCESS: {
      const tags = Object.assign({}, state.tags, {
        list: action.payload,
        loading: false,
        error: null
      });

      const exploreDataset = Object.assign({}, state, {
        tags
      });

      return Object.assign({}, state, exploreDataset);
    }

    case GET_EXPLORE_DATASET_TAGS_ERROR: {
      const tags = Object.assign({}, state.tags, {
        loading: false,
        error: action.payload
      });

      const exploreDataset = Object.assign({}, state, {
        tags
      });

      return Object.assign({}, state, exploreDataset);
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
  return (dispatch, getState) => {
    dispatch({ type: GET_EXPLORE_DATASET_LOADING });

    const state = getState();

    const service = new DatasetService(datasetId, {
      apiURL: process.env.WRI_API_URL,
      language: state.common.locale
    });

    return service.fetchDataset('layer,metadata,vocabulary,widget')
      .then((data) => {
        dispatch({ type: GET_EXPLORE_DATASET_SUCCESS, payload: data });
      })
      .catch((err) => {
        dispatch({ type: GET_EXPLORE_DATASET_ERROR, payload: err.message });
      });
  };
}

export function getPartner(id) {
  return (dispatch) => {
    dispatch({ type: GET_EXPLORE_DATASET_PARTNER_LOADING });

    return fetch(new Request(`${process.env.API_URL}/partners/${id}`))
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((response) => {
        dispatch({
          type: GET_EXPLORE_DATASET_PARTNER_SUCCESS,
          payload: { ...response.data.attributes, id: response.data.id }
        });
      })
      .catch((err) => {
        // Fetch from server ko -> Dispatch error
        dispatch({
          type: GET_EXPLORE_DATASET_PARTNER_ERROR,
          payload: err.message
        });
      });
  };
}

export function getTools() {
  return (dispatch) => {
    dispatch({ type: GET_EXPLORE_DATASET_TOOLS_LOADING });

    return fetch(new Request(`${process.env.API_URL}/tools`))
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((response) => {
        dispatch({
          type: GET_EXPLORE_DATASET_TOOLS_SUCCESS,
          payload: response.data.map(t => ({ ...t.attributes, id: t.id }))
        });
      })
      .catch((err) => {
        // Fetch from server ko -> Dispatch error
        dispatch({
          type: GET_EXPLORE_DATASET_TOOLS_ERROR,
          payload: err.message
        });
      });
  };
}

export function setTools(activeTools) {
  return {
    type: SET_EXPLORE_DATASET_TOOLS,
    payload: activeTools
  };
}

export function getTags() {
  return (dispatch, getState) => {
    dispatch({ type: GET_EXPLORE_DATASET_TAGS_LOADING });

    const tags = getState().exploreDataset.tags.active;
    const service = new GraphService();

    return service.getInferredTags(tags)
      .then((response) => {
        dispatch({
          type: GET_EXPLORE_DATASET_TAGS_SUCCESS,
          payload: response.filter(tag =>
            tag.labels.find(type => type === 'TOPIC' || type === 'GEOGRAPHY') &&
            !TAGS_BLACKLIST.includes(tag.id))
        });
      })
      .catch((err) => {
        // Fetch from server ko -> Dispatch error
        dispatch({
          type: GET_EXPLORE_DATASET_TAGS_ERROR,
          payload: err.message
        });
      });
  };
}

export function setTags(activeTags) {
  return {
    type: SET_EXPLORE_DATASET_TAGS,
    payload: activeTags
  };
}

export function setCountView() {
  return (dispatch, getState) => {
    const { exploreDataset, user } = getState();

    const service = new GraphService();

    if (!user.token) {
      return;
    }

    service.countDatasetView(exploreDataset.data.id, user.token)
      .then(() => {
        dispatch({
          type: SET_EXPLORE_DATASET_COUNT_VIEW
        });
      });
  };
}
