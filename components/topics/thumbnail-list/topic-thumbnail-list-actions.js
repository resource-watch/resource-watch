import 'isomorphic-fetch';
import queryString from 'query-string';
import { createAction, createThunkAction } from 'redux-tools';

// Actions
export const setTopicThumbnailList = createAction('TOPIC_THUMBNAIL_LIST_GET');
export const setLoading = createAction('TOPIC_THUMBNAIL_LIST_LOADING');
export const setError = createAction('TOPIC_THUMBNAIL_LIST_ERROR');
export const setSelected = createAction('TOPIC_THUMBNAIL_LIST_SELECTED');
export const setExpanded = createAction('TOPIC_THUMBNAIL_LIST_EXPANDED');
export const setTotal = createAction('TOPIC_THUMBNAIL_LIST_TOTAL');
export const setPagination = createAction('TOPIC_THUMBNAIL_LIST_PAGINATION');
export const setAdd = createAction('TOPIC_THUMBNAIL_ADD');

// Async actions
export const fetchTopics = createThunkAction('TOPIC_THUMBNAIL_LIST_FETCH_DATA', (payload = {}) => (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  const qParams = queryString.stringify({
    sort: 'name',
    ...payload.filters
  });

  return fetch(new Request(`${process.env.API_URL}/topics?${qParams}`))
    .then(response => response.json())
    .then(({ data }) => {
      dispatch(setLoading(false));
      dispatch(setError(null));
      dispatch(setTotal(data.length));
      dispatch(setTopicThumbnailList(data.map(d =>
        ({ id: d.id, ...d.attributes })
      )));
    })
    .catch((err) => {
      dispatch(setLoading(false));
      dispatch(setError(err));
    });
});
