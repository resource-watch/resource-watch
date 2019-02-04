import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';
import { BitlyClient } from 'bitly';

// Actions
export const setShortLinks = createAction('SET_SHARE_SHORT_LINKS');
export const setLoading = createAction('SET_SHARE_SHORT_LINKS_LOADING');
export const setError = createAction('SET_SHARE_SHORT_LINKS_ERROR');
export const resetShortLinks = createAction('RESET_SHARE_SHORT_LINKS');

const BITLY = new BitlyClient(process.env.BITLY_TOKEN);

// Async actions
export const fetchShortUrl = createThunkAction(
  'SHARE_SHORT_URL_FETCH_DATA',
  (payload = {}) => (dispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    BITLY.shorten(payload.longUrl)
      .then(({ url }) => {
        dispatch(setLoading(false));
        dispatch(setError(null));
        dispatch(setShortLinks({ link: url }));
      })
      .catch((err) => {
        dispatch(setLoading(false));
        dispatch(setError(err));
      });
  }
);
