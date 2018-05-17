import sortBy from 'lodash/sortBy';
import { createAction, createThunkAction } from 'redux-tools';

// Utils
import { TAGS_BLACKLIST } from 'utils/tags';

export const setTags = createAction('DATASET_LIST_ITEM/setTags');
export const setTagsTooltip = createAction('DATASET_LIST_ITEM/setTagsTooltip');
export const setTagsLoading = createAction('DATASET_LIST_ITEM/setTagsLoading');
export const setTagsError = createAction('DATASET_LIST_ITEM/setTagsError');
export const resetTags = createAction('DATASET_LIST_ITEM/resetTags');

// Async actions
export const fetchTags = createThunkAction('DATASET_LIST_ITEM/fetchTags', tags => (dispatch) => {
  dispatch(setTagsLoading(true));

  return fetch(`${process.env.WRI_API_URL}//dataset/${this.datasetId}?application=${process.env.APPLICATIONS}&language=${this.opts.language}&includes="metadata"&page[size]=999`)
    .then((response) => {
      if (response.status >= 400) throw Error(response.statusText);
      return response.json();
    })
    .then(({ data }) => {
      dispatch(setTags(sortBy(
        data.filter(tag => !TAGS_BLACKLIST.includes(tag.id)),
        t => t.label
      )));
      dispatch(setTagsLoading(false));
    })
    .catch((err) => {
      dispatch(setTagsLoading(false));
      dispatch(setTagsError({ payload: err.message }));
    });
});
