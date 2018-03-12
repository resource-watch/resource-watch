import 'isomorphic-fetch';
import { Router } from 'routes';
import { createAction, createThunkAction } from 'redux-tools';

// SEARCH
export const setSearchList = createAction('SEARCH/setSearchList');
export const setSearchTerm = createAction('SEARCH/setSearchTerm');
export const setSearchPage = createAction('SEARCH/setSearchPage');
export const setSearchTotal = createAction('SEARCH/setSearchTotal');
export const setSearchLoading = createAction('SEARCH/setSearchLoading');
export const setSearchError = createAction('SEARCH/setSearchError');

export const fetchSearch = createThunkAction('SEARCH/fetchSearch', () => (dispatch, getState) => {
  const { search } = getState();
  const { term, page, limit } = search;

  if (term && term.length > 0) {
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
