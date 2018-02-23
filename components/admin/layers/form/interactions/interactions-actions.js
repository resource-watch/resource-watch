import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';

import LayersService from 'services/LayersService';

// Actions
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
      .then((interactions) => {
        dispatch(setInteractions({
          added: form.interactionConfig.output,
          available: interactions.fields
        }));
        dispatch(toggleLoading());
      });
  }
});
