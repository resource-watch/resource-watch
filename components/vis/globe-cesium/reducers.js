import * as actions from './actions';

export default {
  [actions.setShapesCreated]: (state, { payload }) =>
    ({ ...state, shapesCreated: payload }),
  [actions.setPosition]: (state, { payload }) =>
    ({ ...state, position: payload }),
  [actions.setInitialPosition]: (state, { payload }) =>
    ({ ...state, initialPosition: payload }),
  [actions.togglePosition]: (state) => {
    if (state.position === 'north_pole') {
      return { ...state, position: 'south_pole' };
    } else if (state.position === 'south_pole') {
      return { ...state, position: 'north_pole' };
    }
    return state;
  }
};
