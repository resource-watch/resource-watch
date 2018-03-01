import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';

// Actions
export const setTopic = createAction('TOPIC_PREVIEW_GET_TOPIC');
export const setLoading = createAction('TOPIC_PREVIEW_LOADING');
export const setError = createAction('TOPIC_PREVIEW_ERROR');

// Async actions
export const fetchTopic = createThunkAction('TOPIC_PREVIEW_FETCH_DATA', (payload = {}) => (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  return fetch(new Request(`${process.env.API_URL}/topics/${payload.id}`))
    .then(response => response.json())
    .then(({ data }) => {
      dispatch(setLoading(false));
      dispatch(setError(null));
      dispatch(setTopic({ id: data.id, ...data.attributes }));
    })
    .catch((err) => {
      dispatch(setLoading(false));
      dispatch(setError(err));
    });
});
