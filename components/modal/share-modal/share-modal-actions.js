import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';

// Actions
export const setShortLinks = createAction('SET_SHARE_SHORT_LINKS');
export const setLoading = createAction('SET_SHARE_SHORT_LINKS_LOADING');
export const setError = createAction('SET_SHARE_SHORT_LINKS_ERROR');
export const resetShortLinks = createAction('RESET_SHARE_SHORT_LINKS');


// Async actions
export const fetchShortUrl = createThunkAction('SHARE_SHORT_URL_FETCH_DATA', (payload = {}) => (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  fetch(new Request(`https://www.googleapis.com/urlshortener/v1/url?key=${process.env.GOGGLE_API_TOKEN_SHORTENER}`), {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .then((response) => {
      dispatch(setLoading(false));
      dispatch(setError(null));
      dispatch(setShortLinks({ link: response.id }));
    })
    .catch((err) => {
      console.error(err);
      dispatch(setLoading(false));
      dispatch(setError(err));
    });
});
