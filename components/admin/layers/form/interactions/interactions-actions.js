import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';

import LayersService from 'services/LayersService';

// Actions
import { generateLayerGroups } from 'components/admin/layers/form/layer-preview/layer-preview-actions';

export const toggleLoading = createAction('ADMIN_TOGGLE_INTERACTIONS_LOADING');
export const setInteractions = createAction('ADMIN_SET_INTERACTIONS');
export const modifyInteractions = createAction('ADMIN_MODIFY_INTERACTION');


export const getInteractions = createThunkAction('ADMIN_GET_INTERACTIONS', props => (dispatch) => {
  dispatch(toggleLoading());
  const { user, form } = props;
  const layerService = new LayersService({
    authorization: user.token
  });
  if (form && form.provider !== 'wms') {
    layerService.getColumns({ dataset: form.dataset })
      .then((data) => {
        const interactions = {
          added: form.interactionConfig.output || [],
          available: data.fields
        };
        dispatch(setInteractions(interactions));
        dispatch(generateLayerGroups({ form, interactions }));
        dispatch(toggleLoading());
      });
  }
});
