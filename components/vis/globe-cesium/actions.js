import { createAction } from 'redux-tools';

export const setShapesCreated = createAction('GLOBE_CESIUM/setShapesCreated');
export const setPosition = createAction('GLOBE_CESIUM/setPosition');
export const setInitialPosition = createAction('GLOBE_CESIUM/setInitialPosition');
export const togglePosition = createAction('GLOBE_CESIUM/togglePosition');
