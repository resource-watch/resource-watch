import * as actions from './actions';

export default {
  [actions.setShapesCreated]: (state, { payload }) =>
    ({ ...state, shapesCreated: payload })
};
