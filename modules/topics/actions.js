import { createAction, createThunkAction } from 'redux-tools';

// service
import {
  fetchTopics,
  fetchTopic,
  updateTopic
} from 'services/TopicsService';

// Actions
export const setTopics = createAction('TOPICS/SET-TOPICS');
export const setLoading = createAction('TOPICS/SET-LOADING');
export const setFilter = createAction('TOPICS/SET-FILTERS');
export const setError = createAction('TOPICS/SET-ERROR');
export const setSelected = createAction('TOPICS/SET-SELECTED');

export const getAllTopics = createThunkAction('TOPICS/GET-ALL-TOPICS',
  () => (dispatch) => {
    dispatch(setLoading({ key: 'all', value: true }));
    dispatch(setError({ key: 'all', value: null }));

    return fetchTopics()
      .then((topics) => {
        dispatch(setTopics({ key: 'all', value: topics }));
        dispatch(setLoading({ key: 'all', value: false }));
      })
      .catch((err) => {
        dispatch(setError({ key: 'all', value: err.message }));
        dispatch(setLoading({ key: 'all', value: false }));
      });
  });

export const getPublishedTopics = createThunkAction('TOPICS/GET-PUBLISHED-TOPICS',
  () => (dispatch) => {
    dispatch(setLoading({ key: 'published', value: true }));
    dispatch(setError({ key: 'published', value: null }));

    const queryParams = {
      filters: {
        'filter[published]': 'true',
        sort: 'name'
      }
    };

    return fetchTopics(queryParams)
      .then((topics) => {
        dispatch(setTopics({ key: 'published', value: topics }));
        dispatch(setLoading({ key: 'published', value: false }));
      })
      .catch((err) => {
        dispatch(setError({ key: 'published', value: err.message }));
        dispatch(setLoading({ key: 'published', value: false }));
      });
  });

export const getTopic = createThunkAction('TOPICS/GET-TOPIC',
  id => (dispatch) => {
    if (!id) throw new Error('A topic ID is mandatory to perform this action.');
    dispatch(setLoading({ key: 'detail', value: true }));
    dispatch(setError({ key: 'detail', value: null }));

    return fetchTopic(id)
      .then((topic) => {
        dispatch(setTopics({ key: 'detail', value: topic }));
        dispatch(setLoading({ key: 'detail', value: false }));
      })
      .catch((err) => {
        dispatch(setError({ key: 'detail', value: err.message }));
        dispatch(setLoading({ key: 'detail', value: false }));
      });
  });

export const onUpdateTopic = createThunkAction('TOPICS/UPDATE-TOPIC',
  id => (dispatch) => {
    if (!id) throw new Error('A topic ID is mandatory to perform this action.');
    dispatch(setLoading({ key: 'detail', value: true }));
    dispatch(setError({ key: 'detail', value: null }));

    return updateTopic(id)
      .then((topic) => {
        dispatch(setTopics({ key: 'detail', value: topic }));
        dispatch(setLoading({ key: 'detail', value: false }));
      })
      .catch((err) => {
        dispatch(setError({ key: 'detail', value: err.message }));
        dispatch(setLoading({ key: 'detail', value: false }));
      });
  });

export default {
  getAllTopics,
  getPublishedTopics,
  getTopic,
  onUpdateTopic
};
