import { createAction, createThunkAction } from 'redux-tools';

// services
import { getFields } from 'services/fields';

export const setCurrentInteractions = createAction('LAYER-INTERACTIONS__SET_CURRENT_INTERACTIONS');
export const setAvailabletInteractions = createAction('LAYER-INTERACTIONS__SET_AVAILABLE_INTERACTIONS');
export const setLoading = createAction('LAYER-INTERACTIONS__SET-LOADING');
export const resetInteractions = createAction('LAYER-INTERACTIONS__RESET_INTERACTIONS');

export const getCurrentLayerInteractions = createThunkAction('LAYER-INTERACTIONS__GET-CURRENT-LAYER-INTERACTIONS', props => (dispatch) => {
  const { layer } = props;
  const { interactionConfig: { output } } = layer;

  dispatch(setCurrentInteractions(output));
});

export const getAvailableLayerInteractions = createThunkAction('LAYER-INTERACTIONS__GET-AVAILABLE-LAYER-INTERACTIONS', props => (dispatch, getState) => {
  const { user: { token } } = getState();
  const { layer } = props;

  dispatch(setLoading(true));

  if (layer && layer.provider !== 'wms') {
    return getFields(layer.dataset, token)
      .then(({ fields }) => {
        const parsedFields = ((fields && Object.keys(fields)) || []).map((fKey) => {
          const { type } = fields[fKey] || null;
          return { label: fKey || '', value: fKey || '', type };
        });

        dispatch(setAvailabletInteractions(parsedFields));
        dispatch(setLoading(false));
      });
  }

  return new Promise((reject) => { reject('Layer provider not supported for getting fields'); });
});

export default {
  setCurrentInteractions,
  setAvailabletInteractions,
  setLoading,
  resetInteractions,
  getCurrentLayerInteractions,
  getAvailableLayerInteractions
};
