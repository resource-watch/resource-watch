import 'isomorphic-fetch';
import queryString from 'query-string';
import WRISerializer from 'wri-json-api-serializer';

import { createAction, createThunkAction } from 'redux-tools';

// Actions
export const setZoom = createAction('EMBED-MAP-SWIPE/setZoom');
export const setLatLng = createAction('EMBED-MAP-SWIPE/setLatLng');
export const setLayerGroups = createAction('EMBED-MAP-SWIPE/setLayerGroups');
export const setLayerGroupsLoading = createAction('EMBED-MAP-SWIPE/setLayerGroupsLoading');
export const setLayerGroupsError = createAction('EMBED-MAP-SWIPE/setLayerGroupsError');

export const fetchLayerGroups = createThunkAction('EMBED-MAP-SWIPE/fetchLayerGroups', payload => (dispatch, getState) => {
  dispatch(setLayerGroupsLoading(true));
  dispatch(setLayerGroupsError(null));

  const { common } = getState();

  const qParams = queryString.stringify({
    ids: payload.layers.join(',')
  });

  return fetch(new Request(`${process.env.WRI_API_URL}/layer?${qParams}`))
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .then(response => WRISerializer(response, { locale: common.locale }))
    .then((data) => {
      const layerGroups = data
        .sort((a, b) => {
          const aIndex = payload.layers.findIndex(p => p === a.id);
          const bIndex = payload.layers.findIndex(p => p === b.id);

          return (aIndex > bIndex ? 1 : -1);
        })
        .map((l, i) => ({
          dataset: l.dataset,
          visible: true,
          opacity: 1,
          layers: [{ ...l, active: true, sideBySide: i === 0 ? 'left' : 'right' }]
        }));

      dispatch(setLayerGroupsLoading(false));
      dispatch(setLayerGroupsError(null));
      dispatch(setLayerGroups(layerGroups));
    })
    .catch((err) => {
      dispatch(setLayerGroupsLoading(false));
      dispatch(setLayerGroupsError(err));
    });
});
