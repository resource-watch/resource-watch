import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';
import { Router } from 'routes';

/**
 * CONSTANTS
*/

const SET_SEARCH_LIST = 'SEARCH/setSearchList';
const SET_SEARCH_TERM = 'SEARCH/setSearchTerm';
const SET_SEARCH_PAGE = 'SEARCH/setSearchPage';
const SET_SEARCH_TOTAL = 'SEARCH/setSearchTotal';
const SET_SEARCH_LOADING = 'SEARCH/setSearchLoading';
const SET_SEARCH_ERROR = 'SEARCH/setSearchError';

/**
 * REDUCER
*/

const initialState = {
  list: [],
  loading: false,
  error: null,
  term: '',
  page: 1,
  total: 0,
  limit: 10
};

export const setSearchList = createAction(SET_SEARCH_LIST);
export const setSearchTerm = createAction(SET_SEARCH_TERM);
export const setSearchPage = createAction(SET_SEARCH_PAGE);
export const setSearchTotal = createAction(SET_SEARCH_TOTAL);
export const setSearchLoading = createAction(SET_SEARCH_LOADING);
export const setSearchError = createAction(SET_SEARCH_ERROR);

export const fetchSearch = createThunkAction('SEARCH/fetchSearch', () => (dispatch, getState) => {
  const { search } = getState();
  const { term, page, limit } = search;

  if (term) {
    dispatch(setSearchLoading(true));
    dispatch(setSearchError(null));

    return fetch(`https://api.addsearch.com/v1/search/${process.env.ADD_SEARCH_KEY}?term=${term}&page=${page}&limit=${limit}&fuzzy=true`)
      .then((response) => {
        if (response.status >= 400) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        /* eslint-disable */
        const { total_hits, hits } = data;
        /* eslint-enable */

        dispatch(setSearchLoading(false));
        dispatch(setSearchError(null));
        dispatch(setSearchTotal(total_hits));
        dispatch(setSearchList(hits));
      })
      .catch((err) => {
        dispatch(setSearchLoading(false));
        dispatch(setSearchError(err));
      });
  }

  dispatch(setSearchTotal(0));
  dispatch(setSearchList([]));
});


export const setSearchUrl = createThunkAction('SEARCH/setSearchUrl', () => (dispatch, getState) => {
  const { search } = getState();
  const { term, page } = search;

  Router.replaceRoute('search', { term, page });
});

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_SEARCH_LIST: {
      return { ...state, list: action.payload };
    }
    case SET_SEARCH_TERM: {
      return { ...state, term: action.payload };
    }
    case SET_SEARCH_PAGE: {
      return { ...state, page: action.payload };
    }
    case SET_SEARCH_TOTAL: {
      return { ...state, total: action.payload };
    }
    case SET_SEARCH_LOADING: {
      return { ...state, loading: action.payload };
    }
    case SET_SEARCH_ERROR: {
      return { ...state, error: action.payload };
    }
    default:
      return state;
  }
}

