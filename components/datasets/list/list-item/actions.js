import sortBy from 'lodash/sortBy';
import { createAction, createThunkAction } from 'redux-tools';

// Utils
import { TAGS_BLACKLIST } from 'utils/graph/TagsUtil';

export const setTags = createAction('DATASET_LIST_ITEM/setTags');
export const setTagsTooltip = createAction('DATASET_LIST_ITEM/setTagsTooltip');
export const setTagsLoading = createAction('DATASET_LIST_ITEM/setTagsLoading');
export const setTagsError = createAction('DATASET_LIST_ITEM/setTagsError');
export const resetTags = createAction('DATASET_LIST_ITEM/resetTags');

// Async actions
export const fetchTags = createThunkAction('DATASET_LIST_ITEM/fetchTags', tags => (dispatch) => {
  dispatch(setTagsLoading(true));

  return fetch(`${process.env.WRI_API_URL}/graph/query/concepts-inferred?concepts=${tags}&application=${process.env.APPLICATIONS}`)
    .then((response) => {
      if (response.status >= 400) throw Error(response.statusText);
      return response.json();
    })
    .then(({ data }) => {
      dispatch(setTagsLoading(false));
      dispatch(setTags(
        sortBy(
          data,
          // data.filter(tag => tag.labels.find(type => (type === 'TOPIC') && !TAGS_BLACKLIST.includes(tag.id))),
          t => t.label
        )
      ));
    })
    .catch((err) => {
      dispatch(setTagsLoading(false));
      dispatch(setTagsError({ payload: err.message }));
    });
});
