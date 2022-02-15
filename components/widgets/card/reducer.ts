import { APILayerSpec } from 'types/layer';

export interface InitialStateProps {
  loading: boolean;
  mapLoading: boolean;
  error: string;
  layer: APILayerSpec;
  tooltip: boolean;
}

export const INITIAL_STATE: InitialStateProps = {
  loading: false,
  mapLoading: true,
  error: null,
  layer: null,
  tooltip: false,
};

export const REDUCER = (state: InitialStateProps, { type, payload }) => {
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
  REDUCER,
};
