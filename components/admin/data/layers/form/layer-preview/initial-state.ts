import type { LngLatLike } from 'mapbox-gl';
import type { LayerGroup } from 'components/map/types';
import type { Interactions } from './types';

export interface LayerPreviewInitialStateProps {
  layerGroups: LayerGroup[];
  interaction: Interactions;
  interactionLatLng: Partial<LngLatLike>;
  interactionSelected: unknown;
}

const initialState: LayerPreviewInitialStateProps = {
  layerGroups: [],
  interaction: {},
  interactionLatLng: {},
  interactionSelected: null,
};

export default initialState;
