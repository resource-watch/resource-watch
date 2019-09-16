import { createAction, createThunkAction } from 'redux-tools';

// services
import { fetchFields } from 'services/fields';

// utils
import { getFieldUrl } from 'utils/fields';

export const setCurrentInteractions = createAction('LAYER-INTERACTIONS__SET_CURRENT_INTERACTIONS');
export const setAvailabletInteractions = createAction('LAYER-INTERACTIONS__SET_AVAILABLE_INTERACTIONS');
export const setLoading = createAction('LAYER-INTERACTIONS__SET-LOADING');
export const resetInteractions = createAction('LAYER-INTERACTIONS__RESET_INTERACTIONS');

export const getCurrentLayerInteractions = createThunkAction('LAYER-INTERACTIONS__GET-CURRENT-LAYER-INTERACTIONS', props => (dispatch) => {
  const { layer } = props;
  const { interactionConfig: { output } } = layer;

  if (output) dispatch(setCurrentInteractions(output));
});

export const getAvailableLayerInteractions = createThunkAction('LAYER-INTERACTIONS__GET-AVAILABLE-LAYER-INTERACTIONS', props => (dispatch) => {
  const { layer } = props;

  dispatch(setLoading(true));

  if (layer && layer.provider !== 'wms') {
    const url = getFieldUrl({ id: layer.dataset });
    return fetchFields(url)
      .then((rawFields) => {
        const parsedFields = ((rawFields && Object.keys(rawFields)) || []).map((fKey) => {
          const { type } = rawFields[fKey] || null;
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
