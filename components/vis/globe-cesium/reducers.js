import * as actions from './actions';

export default {
  [actions.setShapesCreated]: (state, { payload }) =>
    ({ ...state, shapesCreated: payload }),
  [actions.setPosition]: (state, { payload }) =>
    ({ ...state, position: payload }),
  [actions.setInitialPosition]: (state, { payload }) =>
    ({ ...state, initialPosition: payload, position: payload }),
  [actions.togglePosition]: (state) => {
    const newPosition = { ...state.position };
    newPosition.latitude = -state.position.latitude;
    if (state.position.longitude > 0) {
      newPosition.longitude = state.position.longitude - 180;
    } else if (state.position.longitude < 0){
      newPosition.longitude = state.position.longitude + 180;
    }
    return { ...state, position: newPosition };
  }
};
