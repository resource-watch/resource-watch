/* global config */
import 'isomorphic-fetch';

// Services
import DatasetService from 'services/DatasetService';

/**
 * CONSTANTS
*/
const GET_PARTNER_SUCCESS = 'partnerDetail/GET_PARTNER_SUCCESS';
const GET_PARTNER_ERROR = 'partnerDetail/GET_PARTNER_ERROR';
const GET_PARTNER_LOADING = 'partnerDetail/GET_PARTNER_LOADING';
const GET_DATASETS_SUCCESS = 'partnerDetail/GET_DATASETS_SUCCESS';
const GET_DATASETS_ERROR = 'partnerDetail/GET_DATASETS_ERROR';
const GET_DATASETS_LOADING = 'partnerDetail/GET_DATASETS_LOADING';

/**
 * REDUCER
*/
const initialState = {
  data: {},
  datasets: {
    loading: false,
    error: null,
    list: []
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_PARTNER_SUCCESS: {
      return Object.assign({}, state, {
        data: action.payload,
        loading: false,
        error: false
      });
    }

    case GET_PARTNER_ERROR: {
      return Object.assign({}, state, {
        loading: false,
        error: true
      });
    }

    case GET_PARTNER_LOADING: {
      return Object.assign({}, state, {
        loading: true,
        error: null
      });
    }

    case GET_DATASETS_SUCCESS: {
      return Object.assign({}, state, {
        datasets: {
          list: action.payload,
          loading: false,
          error: null
        }
      });
    }

    case GET_DATASETS_ERROR: {
      return Object.assign({}, state, {
        datasets: {
          list: [],
          loading: false,
          error: action.payload
        }
      });
    }

    case GET_DATASETS_LOADING: {
      return Object.assign({}, state, {
        datasets: {
          loading: true,
          error: false,
          list: []
        }
      });
    }

    default:
      return state;
  }
}

/**
 * ACTIONS
 * - getPartnerData
 * - getDatasets
*/
export function getPartnerData(id) {
  return (dispatch) => {
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_PARTNER_LOADING });
    // TODO: remove the date now
    fetch(new Request(`${process.env.API_URL}/partners/${id}`))
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((response) => {
        dispatch({
          type: GET_PARTNER_SUCCESS,
          payload: response.data.attributes
        });
      })
      .catch((err) => {
        // Fetch from server ko -> Dispatch error
        dispatch({
          type: GET_PARTNER_ERROR,
          payload: err.message
        });
      });
  };
}

export function getDatasets(ids) {
  return (dispatch) => {
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_DATASETS_LOADING });

    DatasetService.getDatasets(ids, 'en', 'widget,layer,metadata,vocabulary')
      .then((response) => {
        dispatch({
          type: GET_DATASETS_SUCCESS,
          payload: response
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_DATASETS_ERROR,
          payload: error
        });
      });
  };
}
