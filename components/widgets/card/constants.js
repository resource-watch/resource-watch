export const INITIAL_STATE = {
  loading: false,
  mapLoading: true,
  error: null,
  layer: null,
  tooltip: false
};

export const REDUCER = (state, { type, payload }) => {
  switch (type) {
    case 'WIDGET-CARD/SET_LAYER':
      return { ...state, layer: payload };
    case 'WIDGET-CARD/SET_LOADING':
      return { ...state, loading: payload };
    case 'WIDGET-CARD/SET_MAP_LOADING':
      return { ...state, mapLoading: payload };
    case 'WIDGET-CARD/SET_ERROR':
      return { ...state, error: payload };
    case 'WIDGET-CARD/SET_TOOLTIP':
      return { ...state, tooltip: payload };
    default:
      throw new Error('action not supported');
  }
};

export default {
  INITIAL_STATE,
  REDUCER
};
