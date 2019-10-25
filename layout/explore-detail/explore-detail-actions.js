import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';

// Services
import {
  fetchInferredTags,
  countDatasetView
} from 'services/graph';
import { fetchDataset } from 'services/dataset';

// Helpers
import { TAGS_BLACKLIST } from 'utils/tags';


// DATASET
export const setDataset = createAction('EXPLORE-DETAIL/setDataset');
export const setDatasetLoading = createAction('EXPLORE-DETAIL/setDatasetLoading');
export const setDatasetError = createAction('EXPLORE-DETAIL/setDatasetError');
export const getDataset = createThunkAction('EXPLORE-DETAIL/getDataset', (payload = {}) => (dispatch, getState) => {
  const state = getState();
  dispatch(setDatasetLoading(true));
  dispatch(setDatasetError(null));

  return fetchDataset(payload.id,
    {
      application: process.env.APPLICATIONS,
      language: state.common.locale,
      includes: 'layer,metadata,vocabulary,widget',
      'page[size]': 9999
    })
    .then((data) => {
      dispatch(setDatasetLoading(false));
      dispatch(setDatasetError(null));
      dispatch(setDataset(data));
    })
    .catch((err) => {
      dispatch(setDatasetLoading(false));
      dispatch(setDatasetError(err));
    });
});


// PARTNER
export const setPartner = createAction('EXPLORE-DETAIL/setPartner');
export const setPartnerLoading = createAction('EXPLORE-DETAIL/setPartnerLoading');
export const setPartnerError = createAction('EXPLORE-DETAIL/setPartnerError');
export const fetchPartner = createThunkAction('WIDGET-DETAIL/fetchPartner', (payload = {}) => (dispatch) => {
  dispatch(setPartnerLoading(true));
  dispatch(setPartnerError(null));


  return fetch(new Request(`${process.env.WRI_API_URL}/partner/${payload.id}`))
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .then(({ data }) => {
      dispatch(setPartnerLoading(false));
      dispatch(setPartnerError(null));
      dispatch(setPartner({ ...data.attributes, id: data.id }));
    })
    .catch((err) => {
      dispatch(setPartnerLoading(false));
      dispatch(setPartnerError(err));
    });
});


// TAGS
export const setActiveTags = createAction('EXPLORE-DETAIL/setActiveTags');
export const setTags = createAction('EXPLORE-DETAIL/setTags');
export const setTagsLoading = createAction('EXPLORE-DETAIL/setTagsLoading');
export const setTagsError = createAction('EXPLORE-DETAIL/setTagsError');
export const fetchTags = createThunkAction('WIDGET-DETAIL/fetchTags', () => (dispatch, getState) => {
  dispatch(setTagsLoading(true));
  dispatch(setTagsError(null));

  const tags = getState().exploreDetail.tags.active;

  if (tags.length) {
    return fetchInferredTags(tags)
      .then((response) => {
        dispatch(setTags(response.filter(tag =>
          tag.labels.find(type => type === 'TOPIC' || type === 'GEOGRAPHY') &&
          !TAGS_BLACKLIST.includes(tag.id))));
      })
      .catch((err) => {
        dispatch(setTagsLoading(false));
        dispatch(setTagsError(err));
      });
  }

  return null;
});

// COUNT VIEW
export const setCountView = createThunkAction('WIDGET-DETAIL/setCountView', () => (dispatch, getState) => {
  const { exploreDetail, user } = getState();
  if (!user.token) {
    return;
  }
  countDatasetView(exploreDetail.data.id, user.token);
});
