import { createAction, createThunkAction } from 'redux-tools';
import { BitlyClient } from 'bitly';

// Actions
export const setShortLinks = createAction('SET_SHARE_SHORT_LINKS');
export const setLoading = createAction('SET_SHARE_SHORT_LINKS_LOADING');
export const setError = createAction('SET_SHARE_SHORT_LINKS_ERROR');
export const resetShortLinks = createAction('RESET_SHARE_SHORT_LINKS');

const BITLY = new BitlyClient(process.env.NEXT_PUBLIC_BITLY_TOKEN);

// Async actions
export const fetchShortUrl = createThunkAction(
  'SHARE_SHORT_URL_FETCH_DATA',
  (payload = {}) => (dispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    BITLY.shorten(payload.longUrl)
      .then(({ link }) => {
        dispatch(setLoading(false));
        dispatch(setError(null));
        dispatch(setShortLinks({ link }));
      })
      .catch((err) => {
        dispatch(setLoading(false));
        dispatch(setError(err));
      });
  },
);
