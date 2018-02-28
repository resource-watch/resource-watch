import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';
import WRISerializer from 'wri-json-api-serializer';

// Services
import GraphService from 'services/GraphService';

// Helpers
import { TAGS_BLACKLIST } from 'utils/graph/TagsUtil';


// DATASET
export const setDataset = createAction('EXPLORE-DETAIL/setDataset');
export const setDatasetLoading = createAction('EXPLORE-DETAIL/setDatasetLoading');
export const setDatasetError = createAction('EXPLORE-DETAIL/setDatasetError');
export const fetchDataset = createThunkAction('WIDGET-DETAIL/fetchDataset', (payload = {}) => (dispatch, getState) => {
  const state = getState();
  dispatch(setDatasetLoading(true));
  dispatch(setDatasetError(null));

  return fetch(`${process.env.WRI_API_URL}/dataset/${payload.id}?application=${process.env.APPLICATIONS}&language=${state.common.locale}&includes=layer,metadata,vocabulary,widget&page[size]=9999`)
    .then((response) => {
      if (response.status >= 400) throw Error(response.statusText);
      return response.json();
    })
    .then(body => WRISerializer(body, { locale: state.common.locale }))
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


  return fetch(new Request(`${process.env.API_URL}/partners/${payload.id}`))
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


// TOOLS
export const setActiveTools = createAction('EXPLORE-DETAIL/setActiveTools');
export const setTools = createAction('EXPLORE-DETAIL/setTools');
export const setToolsLoading = createAction('EXPLORE-DETAIL/setToolsLoading');
export const setToolsError = createAction('EXPLORE-DETAIL/setToolsError');
export const fetchTools = createThunkAction('WIDGET-DETAIL/fetchTools', () => (dispatch) => {
  dispatch(setToolsLoading(true));
  dispatch(setToolsError(null));


  return fetch(new Request(`${process.env.API_URL}/tools`))
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .then(({ data }) => {
      dispatch(setToolsLoading(false));
      dispatch(setToolsError(null));
      dispatch(setTools(data.map(t => ({ ...t.attributes, id: t.id }))));
    })
    .catch((err) => {
      dispatch(setToolsLoading(false));
      dispatch(setToolsError(err));
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
  const service = new GraphService();

  if (tags.length) {
    return service.getInferredTags(tags)
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

  const service = new GraphService();

  if (!user.token) {
    return;
  }

  service.countDatasetView(exploreDetail.data.id, user.token);
});
