/* global config */
import 'isomorphic-fetch';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import { Router } from 'routes';

/**
 * CONSTANTS
*/
const GET_DATASETS_SUCCESS = 'explore/GET_DATASETS_SUCCESS';
const GET_DATASETS_ERROR = 'explore/GET_DATASETS_ERROR';
const GET_DATASETS_LOADING = 'explore/GET_DATASETS_LOADING';

const GET_VOCABULARIES_SUCCESS = 'explore/GET_VOCABULARIES_SUCCESS';
const GET_VOCABULARIES_ERROR = 'explore/GET_VOCABULARIES_ERROR';
const GET_VOCABULARIES_LOADING = 'explore/GET_VOCABULARIES_LOADING';

const SET_DATASETS_PAGE = 'explore/SET_DATASETS_PAGE';
const SET_DATASETS_SEARCH_FILTER = 'explore/SET_DATASETS_SEARCH_FILTER';
const SET_DATASETS_ISSUE_FILTER = 'explore/SET_DATASETS_ISSUE_FILTER';
const SET_DATASETS_MODE = 'explore/SET_DATASETS_MODE';

const SET_LAYERGROUP_TOGGLE = 'explore/SET_LAYERGROUP_TOGGLE';
const SET_LAYERGROUP_VISIBILITY = 'explore/SET_LAYERGROUP_VISIBILITY';
const SET_LAYERGROUP_ACTIVE_LAYER = 'explore/SET_LAYERGROUP_ACTIVE_LAYER';
const SET_LAYERGROUP_ORDER = 'explore/SET_LAYERGROUP_ORDER';
const SET_LAYERGROUPS = 'explore/SET_LAYERGROUPS';

const SET_SIDEBAR = 'explore/SET_SIDEBAR';

/**
 * Layer
 * @typedef {Object} Layer
 * @property {string} id - ID of the associated layer
 * @property {boolean} active - If the layer is the one to be displayed
 */

/**
 * Group of layers
 * @typedef {Object} LayerGroup
 * @property {string} dataset - ID of the associated dataset
 * @property {boolean} visible - Indicates whether the group is visible
 * @property {Layer[]} layers - Actual list of layers
 */

/**
 * REDUCER
*/
const initialState = {
  datasets: {
    list: [],
    loading: false,
    error: false,
    page: 1,
    limit: 9,
    mode: 'grid' // 'grid' or 'list'
  },
  // List of layers (corresponding to the datasets
  // set as active)
  //
  // NOTES:
  //  * If a layer is removed from the map, it is removed
  // from this list
  //  * This list does not contain the attributes of the
  // layers, just the information necessary to retrieve
  // the layers in the list of datasets
  //  * The groups are sorted according to the order the
  // user has set in the legend
  /** @type {LayerGroup[]} */
  layers: [],
  filters: {
    search: null,
    issue: null
  },
  vocabularies: {
    list: [],
    loading: false,
    error: false
  },
  sidebar: {
    open: true,
    width: 0
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_DATASETS_SUCCESS: {
      const datasets = Object.assign({}, state.datasets, {
        list: action.payload,
        loading: false,
        error: false
      });
      return Object.assign({}, state, { datasets });
    }

    case GET_DATASETS_ERROR: {
      const datasets = Object.assign({}, state.datasets, {
        loading: false,
        error: true
      });
      return Object.assign({}, state, { datasets });
    }

    case GET_DATASETS_LOADING: {
      const datasets = Object.assign({}, state.datasets, {
        loading: true,
        error: false
      });
      return Object.assign({}, state, { datasets });
    }

    case GET_VOCABULARIES_SUCCESS: {
      const vocabularies = Object.assign({}, state.vocabularies, {
        list: action.payload,
        loading: false,
        error: false
      });
      return Object.assign({}, state, { vocabularies });
    }

    case GET_VOCABULARIES_ERROR: {
      const vocabularies = Object.assign({}, state.vocabularies, {
        loading: false,
        error: true
      });
      return Object.assign({}, state, { vocabularies });
    }

    case GET_VOCABULARIES_LOADING: {
      const vocabularies = Object.assign({}, state.vocabularies, {
        loading: true,
        error: false
      });
      return Object.assign({}, state, { vocabularies });
    }

    case SET_LAYERGROUP_TOGGLE: {
      if (action.payload.add) { // We add a layer group
        const dataset = state.datasets.list.find(d => d.id === action.payload.dataset);
        if (!dataset) return state;
        const layers = [...state.layers];
        layers.unshift({
          dataset: dataset.id,
          visible: true,
          layers: dataset.attributes.layer.map((l, index) => ({ id: l.id, active: index === 0 }))
        });
        return Object.assign({}, state, { layers });
      // eslint-disable-next-line no-else-return
      } else { // We remove a layer group
        const layers = state.layers.filter(l => l.dataset !== action.payload.dataset);
        return Object.assign({}, state, { layers });
      }
    }

    case SET_LAYERGROUP_VISIBILITY: {
      const layers = state.layers.map((l) => {
        if (l.dataset !== action.payload.dataset) return l;
        return Object.assign({}, l, { visible: action.payload.visible });
      });
      return Object.assign({}, state, { layers });
    }

    case SET_LAYERGROUP_ACTIVE_LAYER: {
      const layerGroups = state.layers.map((l) => {
        if (l.dataset !== action.payload.dataset) return l;
        const layers = l.layers.map((la) => { // eslint-disable-line arrow-body-style
          return Object.assign({}, la, { active: la.id === action.payload.layer });
        });
        return Object.assign({}, l, { layers });
      });
      return Object.assign({}, state, { layers: layerGroups });
    }

    case SET_LAYERGROUP_ORDER: {
      const layers = action.payload.map(d => state.layers.find(l => l.dataset === d));
      return Object.assign({}, state, { layers });
    }

    case SET_LAYERGROUPS: {
      return Object.assign({}, state, { layers: action.payload });
    }

    case SET_DATASETS_PAGE: {
      const datasets = Object.assign({}, state.datasets, {
        page: action.payload
      });
      return Object.assign({}, state, { datasets });
    }

    case SET_DATASETS_MODE: {
      const datasets = Object.assign({}, state.datasets, {
        mode: action.payload
      });
      return Object.assign({}, state, { datasets });
    }

    case SET_DATASETS_SEARCH_FILTER: {
      const filters = Object.assign({}, state.filters, {
        search: action.payload
      });
      return Object.assign({}, state, { filters });
    }

    case SET_DATASETS_ISSUE_FILTER: {
      const filters = Object.assign({}, state.filters, {
        issue: action.payload
      });
      return Object.assign({}, state, { filters });
    }

    case SET_SIDEBAR: {
      return Object.assign({}, state, {
        sidebar: action.payload
      });
    }

    default:
      return state;
  }
}

// Let's use {replace} instead of {push}, that's how we will allow users to
// go away from the current page
export function setUrlParams() {
  return (dispatch, getState) => {
    const { explore } = getState();
    const layerGroups = explore.layers;
    const { page } = explore.datasets;
    const { search, issue } = explore.filters;

    const query = { page };

    if (layerGroups.length) {
      query.layers = encodeURIComponent(JSON.stringify(layerGroups));
    }

    if (search && search.value) {
      query.search = search.value;
    }

    if (issue) {
      query.issue = JSON.stringify(issue);
    }

    Router.replaceRoute('explore', query);
  };
}

export function getDatasets() {
  return (dispatch) => {
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_DATASETS_LOADING });

    fetch(new Request(`${process.env.WRI_API_URL}/dataset?application=rw&status=saved&published=true&includes=widget,layer,metadata,vocabulary&page[size]=999&sort=-updatedAt`))
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((response) => {
        // TODO: We should check which app do we want here
        // Filtering datasets that have widget or layer
        // and only belong to RW app
        const datasets = response.data;
        dispatch({
          type: GET_DATASETS_SUCCESS,
          payload: datasets
        });
      })
      .catch((err) => {
        // Fetch from server ko -> Dispatch error
        dispatch({
          type: GET_DATASETS_ERROR,
          payload: err.message
        });
      });
  };
}

export function getVocabularies() {
  return (dispatch) => {
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_VOCABULARIES_LOADING });
    // Hardcoding vocabulary
    // old URL: `${process.env.WRI_API_URL}/vocabulary`
    fetch(new Request('/static/data/vocabulary.json'))
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((response) => {
        const vocabularies = response.data.map(voc => (
          {
            label: voc.attributes.name
              .replace(/([A-Z])/g, ' $1')
              .replace(/([-_])/g, ' ')
              .replace(/^./, str => str.toUpperCase()),
            value: voc.attributes.name,
            items: uniq(flatten(voc.attributes.resources.map(t => t.tags), e => e))
              .map(it => ({ label: it, value: it }))
          }
        ));

        dispatch({
          type: GET_VOCABULARIES_SUCCESS,
          payload: vocabularies
        });
      })
      .catch((err) => {
        // Fetch from server ko -> Dispatch error
        dispatch({
          type: GET_VOCABULARIES_ERROR,
          payload: err.message
        });
      });
  };
}

export function setDatasetsPage(page) {
  return (dispatch) => {
    dispatch({
      type: SET_DATASETS_PAGE,
      payload: page
    });

    // We also update the URL
    if (typeof window !== 'undefined') dispatch(setUrlParams());
  };
}

/**
 * Add or remove a layer group from the map and legend
 * @export
 * @param {string} dataset - ID of the dataset
 * @param {boolean} addLayer - Whether to add the group or remove it
 */
export function toggleLayerGroup(dataset, addLayer) {
  return (dispatch) => {
    dispatch({
      type: SET_LAYERGROUP_TOGGLE,
      payload: { dataset, [addLayer ? 'add' : 'remove']: true }
    });

    // We also update the URL
    if (typeof window !== 'undefined') dispatch(setUrlParams());
  };
}

/**
 * Show or hide a layer group on the map
 * @export
 * @param {string} dataset - ID of the dataset
 * @param {boolean} visible - Whether to show the group or hide it
 */
export function toggleLayerGroupVisibility(dataset, visible) {
  return (dispatch) => {
    dispatch({
      type: SET_LAYERGROUP_VISIBILITY,
      payload: { dataset, visible }
    });

    // We also update the URL
    if (typeof window !== 'undefined') dispatch(setUrlParams());
  };
}

/**
 * Set which of the layer group's layers is the active one
 * (the one to be displayed)
 * @export
 * @param {string} dataset - ID of the dataset
 * @param {string} layer - ID of the layer
 */
export function setLayerGroupActiveLayer(dataset, layer) {
  return (dispatch) => {
    dispatch({
      type: SET_LAYERGROUP_ACTIVE_LAYER,
      payload: { dataset, layer }
    });

    // We also update the URL
    if (typeof window !== 'undefined') dispatch(setUrlParams());
  };
}

/**
 * Change the order of the layer groups according to the
 * order of the dataset IDs
 * @export
 * @param {string[]} datasets - List of dataset IDs
 */
export function setLayerGroupsOrder(datasets) {
  return (dispatch) => {
    dispatch({
      type: SET_LAYERGROUP_ORDER,
      payload: datasets
    });

    // We also update the URL
    if (typeof window !== 'undefined') dispatch(setUrlParams());
  };
}

/**
 * Set the layer attribute of the store
 * This method is used when the layer groups are retrieved
 * from the URL to restore the state
 * @export
 * @param {LayerGroup[]} layerGroups
 */
export function setLayerGroups(layerGroups) {
  return (dispatch) => {
    dispatch({
      type: SET_LAYERGROUPS,
      payload: layerGroups
    });

    // We also update the URL
    if (typeof window !== 'undefined') dispatch(setUrlParams());
  };
}

export function setSidebar(options) {
  return {
    type: SET_SIDEBAR,
    payload: options
  };
}

export function setDatasetsSearchFilter(search) {
  return (dispatch) => {
    dispatch({
      type: SET_DATASETS_SEARCH_FILTER,
      payload: search
    });

    // We also update the URL
    if (typeof window !== 'undefined') dispatch(setUrlParams());
  };
}

export function setDatasetsIssueFilter(issue) {
  return (dispatch) => {
    dispatch({
      type: SET_DATASETS_ISSUE_FILTER,
      payload: issue
    });

    // We also update the URL
    if (typeof window !== 'undefined') dispatch(setUrlParams());
  };
}

export function setDatasetsMode(mode) {
  return {
    type: SET_DATASETS_MODE,
    payload: mode
  };
}
