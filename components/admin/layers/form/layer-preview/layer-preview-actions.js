import 'isomorphic-fetch';
import { createAction } from 'redux-tools';

// Actions
export const setLayerGroups = createAction('ADMIN_LAYER_PREVIEW_SET_LAYER_GROUPS');

export const setLayerInteraction = createAction('ADMIN_LAYER_PREVIEW_SET_LAYER_INTERACTION');
export const setLayerInteractionSelected = createAction('ADMIN_LAYER_PREVIEW_SET_LAYER_INTERACTION_SELECTED');
export const setLayerInteractionLatLng = createAction('ADMIN_LAYER_PREVIEW_SET_LAYER_INTERACTION_LATLNG');
