import type { APILayerSpec } from 'types/layer';
export type Basemap = 'dark' | 'light' | 'satellite' | 'terrain' | 'aqueduct';
export type Labels = 'dark' | 'light' | 'none';

export interface LayerGroup {
  dataset: string;
  visible: boolean;
  layers: APILayerSpec[];
}
