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

const SET_DATASETS_ACTIVE = 'explore/SET_DATASETS_ACTIVE';
const SET_DATASETS_HIDDEN = 'explore/SET_DATASETS_HIDDEN';
const SET_DATASETS_PAGE = 'explore/SET_DATASETS_PAGE';
const SET_DATASETS_SEARCH_FILTER = 'explore/SET_DATASETS_SEARCH_FILTER';
const SET_DATASETS_ISSUE_FILTER = 'explore/SET_DATASETS_ISSUE_FILTER';
const SET_DATASETS_MODE = 'explore/SET_DATASETS_MODE';

const SET_SIDEBAR = 'explore/SET_SIDEBAR';

/**
 * REDUCER
*/
const initialState = {
  datasets: {
    list: [],
    loading: false,
    error: false,
    active: [],
    hidden: [],
    page: 1,
    limit: 9,
    mode: 'grid' // 'grid' or 'list'
  },
  filters: [],
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

    case SET_DATASETS_ACTIVE: {
      const datasets = Object.assign({}, state.datasets, {
        active: action.payload
      });

      return Object.assign({}, state, { datasets });
    }

    case SET_DATASETS_HIDDEN: {
      const datasets = Object.assign({}, state.datasets, {
        hidden: action.payload
      });

      return Object.assign({}, state, { datasets });
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

/**
 * ACTIONS
 * - getDatasets
 * - setDatasetsPage
 * - toggleDatasetActive
*/
export function getDatasets() {
  return (dispatch) => {
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_DATASETS_LOADING });
    // TODO: remove the date now
    fetch(new Request(`${process.env.WRI_API_URL}/dataset?application=rw&status=saved&published=true&includes=widget,layer,metadata,vocabulary&page[size]=9999&_d=${Date.now()}`))
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
  return {
    type: SET_DATASETS_PAGE,
    payload: page
  };
}

export function setDatasetsActive(active) {
  return {
    type: SET_DATASETS_ACTIVE,
    payload: active
  };
}

export function setDatasetsHidden(hidden) {
  return {
    type: SET_DATASETS_HIDDEN,
    payload: hidden
  };
}


export function toggleDatasetActive(id) {
  return (dispatch, getState) => {
    const { explore } = getState();
    let active = explore.datasets.active.slice();

    active = active.includes(id) ?
      active.filter(a => a !== id) :
      active.concat(id);

    dispatch({
      type: SET_DATASETS_ACTIVE,
      payload: active
    });
  };
}

// Let's use {replace} instead of {push}, that's how we will allow users to
// go away from the current page
export function setUrlParams() {
  return (dispatch, getState) => {
    const { explore } = getState();
    const { active, page } = explore.datasets;

    const query = { page };
    if (active.length) {
      query.active = active.join(',');
    }

    Router.replaceRoute('explore', query);
  };
}

export function setSidebar(options) {
  return {
    type: SET_SIDEBAR,
    payload: options
  };
}

export function setDatasetsSearchFilter(search) {
  return {
    type: SET_DATASETS_SEARCH_FILTER,
    payload: search
  };
}

export function setDatasetsIssueFilter(search) {
  return {
    type: SET_DATASETS_SEARCH_FILTER,
    payload: search
  };
}

export function setDatasetsMode(mode) {
  return {
    type: SET_DATASETS_MODE,
    payload: mode
  };
}
