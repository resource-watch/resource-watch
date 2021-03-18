import { createAction, createThunkAction } from 'redux-tools';

// service
import { fetchPage } from 'services/pages';

// actions
export const setContentPage = createAction('STATIC-PAGES__SET-CONTENT-PAGE');
export const setLoading = createAction('STATIC-PAGES__SET-LOADING');
export const setError = createAction('STATIC-PAGES__SET-ERROR');

export const getStaticPage = createThunkAction('STATIC-PAGES__GET-STATIC-PAGE',
  (page) => (dispatch, getState) => {
    const {
      user: {
        token,
      },
    } = getState();
    dispatch(setLoading({ key: page, value: true }));
    dispatch(setError(true));

    return fetchPage(page, token)
      .then((contentPage) => {
        dispatch(setContentPage({ key: page, value: contentPage }));
        dispatch(setLoading(false));
      })
      .catch((err) => {
        dispatch(setError(err));
        dispatch(setLoading(false));
      });
  });

export default {
  setContentPage,
  setLoading,
  setError,
  getStaticPage,
};
