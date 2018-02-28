import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';
import { EINTR } from 'constants';

// Actions
export const setLayerGroups = createAction('ADMIN_LAYER_PREVIEW_SET_LAYER_GROUPS');

export const setLayerInteraction = createAction('ADMIN_LAYER_PREVIEW_SET_LAYER_INTERACTION');
export const setLayerInteractionSelected = createAction('ADMIN_LAYER_PREVIEW_SET_LAYER_INTERACTION_SELECTED');
export const setLayerInteractionLatLng = createAction('ADMIN_LAYER_PREVIEW_SET_LAYER_INTERACTION_LATLNG');
export const generateLayerGroups = createThunkAction('ADMIN_LAYER_PREVIEW_GENERATE_LAYER_GROUPS', payload => (dispatch) => {
  const { form, interactions } = payload;
  const layerGroups = [{
    dataset: form.dataset,
    visible: true,
    layers: [{
      active: true,
      application: form.application,
      layerConfig: form.layerConfig,
      interactionConfig: Object.assign({}, form.interactionConfig, { output: interactions.added }),
      legendConfig: form.legendConfig,
      id: form.id,
      name: form.name,
      provider: form.provider,
      slug: form.slug,
      iso: form.iso,
      description: form.description
    }]
  }];
  dispatch(setLayerGroups({ layerGroups }));
});
