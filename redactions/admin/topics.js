import 'isomorphic-fetch';
import TopicsService from 'services/TopicsService';

/**
 * CONSTANTS
*/
const GET_TOPICS_SUCCESS = 'topics/GET_TOPICS_SUCCESS';
const GET_TOPICS_ERROR = 'topics/GET_TOPICS_ERROR';
const GET_TOPICS_LOADING = 'topics/GET_TOPICS_LOADING';

const SET_TOPICS_FILTERS = 'topics/SET_TOPICS_FILTERS';

const DELETE_TOPIC_SUCCESS = 'topics/DELETE_TOPIC_SUCCESS';
const DELETE_TOPIC_ERROR = 'topics/DELETE_TOPIC_ERROR';
const DELETE_TOPIC_LOADING = 'topics/DELETE_TOPIC_LOADING';


/**
 * STORE
 * @property {string} topics.error
 * @property {{ key: string, value: string|number }[]} topics.filters
 */
const initialState = {
  topics: {
    list: [], // Actual list of topics
    loading: false, // Are we loading the data?
    error: null, // An error was produced while loading the data
    filters: [] // Filters for the list of topics
  }
};

const service = new TopicsService();

/**
 * REDUCER
 * @export
 * @param {initialState} state
 * @param {{ type: string, payload: any }} action
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_TOPICS_LOADING: {
      const topics = Object.assign({}, state.topics, {
        loading: true,
        error: null
      });
      return Object.assign({}, state, { topics });
    }

    case GET_TOPICS_SUCCESS: {
      const topics = Object.assign({}, state.topics, {
        list: action.payload,
        loading: false,
        error: null
      });
      return Object.assign({}, state, { topics });
    }

    case GET_TOPICS_ERROR: {
      const topics = Object.assign({}, state.topics, {
        loading: false,
        error: action.payload
      });
      return Object.assign({}, state, { topics });
    }

    case SET_TOPICS_FILTERS: {
      const topics = Object.assign({}, state.topics, { filters: action.payload });
      return Object.assign({}, state, { topics });
    }

    default:
      return state;
  }
}

/**
 * ACTIONS
 */

/**
 * Retrieve the list of topics
 * @export
 * @param {string[]} applications Name of the applications to load the topics from
 */
export function getTopics(options) {
  return (dispatch) => {
    dispatch({ type: GET_TOPICS_LOADING });

    service.fetchAllData(options)
      .then((data) => {
        dispatch({ type: GET_TOPICS_SUCCESS, payload: data });
      })
      .catch((err) => {
        dispatch({ type: GET_TOPICS_ERROR, payload: err.message });
      });
  };
}

/**
 * Set the filters for the list of topics
 * @export
 * @param {{ key: string, value: string|number }[]} filters List of filters
 */
export function setFilters(filters) {
  return dispatch => dispatch({
    type: SET_TOPICS_FILTERS,
    payload: filters
  });
}

/**
 * Delete current topic
 * @export
 * @param {string[]} applications Name of the applications to load the topics from
 */
export function deleteTopic({ id }) {
  return (dispatch, getState) => {
    dispatch({ type: DELETE_TOPIC_LOADING });

    return service.deleteData({ id, auth: getState().user.token })
      .then((data) => {
        dispatch({ type: DELETE_TOPIC_SUCCESS, payload: data });
      })
      .catch((err) => {
        dispatch({ type: DELETE_TOPIC_ERROR, payload: err.message });
      });
  };
}
