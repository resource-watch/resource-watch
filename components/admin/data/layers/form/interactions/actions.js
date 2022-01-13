import { createAction, createThunkAction } from 'redux-tools';

// services
import { fetchCartoFields, fetchFields } from 'services/fields';

// utils
import { getFieldUrl, parseFields } from 'utils/fields';

export const setCurrentInteractions = createAction('LAYER-INTERACTIONS__SET_CURRENT_INTERACTIONS');
export const setAvailableInteractions = createAction(
  'LAYER-INTERACTIONS__SET_AVAILABLE_INTERACTIONS',
);
export const setLoading = createAction('LAYER-INTERACTIONS__SET-LOADING');
export const resetInteractions = createAction('LAYER-INTERACTIONS__RESET_INTERACTIONS');

export const getAvailableLayerInteractions = createThunkAction(
  'LAYER-INTERACTIONS__GET-AVAILABLE-LAYER-INTERACTIONS',
  (layer) => async (dispatch) => {
    if (!layer)
      return new Promise((reject) => {
        reject('Layer is mandatory');
      });

    dispatch(setLoading(true));

    if (layer.provider === 'cartodb') {
      const {
        layerConfig: { source },
      } = layer;
      const {
        provider: { account, layers },
      } = source;
      const {
        options: { sql },
      } = layers[0] || {};

      try {
        const { fields } = await fetchCartoFields({ account, sql });
        const parsedFields = parseFields(fields);
        const {
          interactionConfig: { output },
        } = layer;

        const currentInteractions = (output || []).map((interaction) => {
          const { column } = interaction;
          const interactionData = parsedFields.find(({ value }) => value === column);

          return {
            ...interaction,
            ...(interactionData && { type: interactionData.type }),
          };
        });

        dispatch(setAvailableInteractions(parsedFields));
        dispatch(setCurrentInteractions(currentInteractions));
        dispatch(setLoading(false));
      } catch (error) {
        dispatch(setLoading(false));
        throw error;
      }
    }

    if (layer.provider && !['cartodb', 'wms'].includes(layer.provider)) {
      const url = getFieldUrl({ id: layer.dataset });

      try {
        const { fields } = await fetchFields(url);
        const parsedFields = parseFields(fields);
        const {
          interactionConfig: { output },
        } = layer;

        const currentInteractions = output.map((interaction) => {
          const { column } = interaction;
          const interactionData = parsedFields.find(({ value }) => value === column);

          return {
            ...interaction,
            ...(interactionData && { type: interactionData.type }),
          };
        });

        dispatch(setAvailableInteractions(parsedFields));
        dispatch(setCurrentInteractions(currentInteractions));
        dispatch(setLoading(false));
      } catch (e) {
        dispatch(setLoading(false));
        throw new Error(e.message);
      }
    }

    return new Promise((reject) => {
      reject('Layer provider not supported for getting fields');
    });
  },
);
