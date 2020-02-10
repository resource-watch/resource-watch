import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';

// Actions
export const setLayerGroups = createAction('ADMIN_LAYER_PREVIEW_SET_LAYER_GROUPS');

export const setLayerInteractionError = createAction('ADMIN_LAYER_PREVIEW_SET_LAYER_INTERACTION_ERROR');
export const setLayerInteraction = createAction('ADMIN_LAYER_PREVIEW_SET_LAYER_INTERACTION');
export const setLayerInteractionSelected = createAction('ADMIN_LAYER_PREVIEW_SET_LAYER_INTERACTION_SELECTED');
export const setLayerInteractionLatLng = createAction('ADMIN_LAYER_PREVIEW_SET_LAYER_INTERACTION_LATLNG');
export const generateLayerGroups = createThunkAction('ADMIN_LAYER_PREVIEW_GENERATE_LAYER_GROUPS', payload => (dispatch) => {
  const { layer, interactions } = payload;
  const layerGroups = [{
    dataset: layer.dataset,
    visible: true,
    layers: [{
      active: true,
      application: layer.application,
      layerConfig: layer.layerConfig,
      interactionConfig: {
        ...layer.interactionConfig,
        output: interactions
      },
      legendConfig: layer.legendConfig,
      id: layer.id,
      name: layer.name,
      provider: layer.provider,
      slug: layer.slug,
      iso: layer.iso,
      description: layer.description,
      ...layer.layerConfig.layerType && { layerType: layer.layerConfig.layerType }
    }]
  }];
  dispatch(setLayerGroups({ layerGroups }));
});
