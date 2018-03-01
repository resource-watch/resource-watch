import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';

// Actions
export const setTopic = createAction('TOPIC-DETAIL/setTopic');
export const setTopicLoading = createAction('TOPIC-DETAIL/setTopicLoading');
export const setTopicError = createAction('TOPIC-DETAIL/setTopicError');

// Async actions
export const fetchTopic = createThunkAction('TOPIC-DETAIL/fetchTopic', (payload = {}) => (dispatch) => {
  dispatch(setTopicLoading(true));
  dispatch(setTopicError(null));

  return fetch(new Request(`${process.env.API_URL}/topics/${payload.id}`))
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .then(({ data }) => {
      dispatch(setTopicLoading(false));
      dispatch(setTopicError(null));
      dispatch(setTopic({ id: data.id, ...data.attributes }));
    })
    .catch((err) => {
      dispatch(setTopicLoading(false));
      dispatch(setTopicError(err));
    });
});
