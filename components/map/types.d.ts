import type { APILayerSpec } from 'types/layer';

export type Basemap = 'dark' | 'light' | 'satellite' | 'terrain' | 'aqueduct';
export type Labels = 'dark' | 'light' | 'none';

export interface APILayerActiveSpec extends APILayerSpec {
  active?: boolean;
}

export interface Bounds {
  bbox: [number, number, number, number];
  options?: Record<string, string | number>;
}

export interface LayerGroup {
  dataset?: string;
  id?: string;
  visible: boolean;
  layers: APILayerActiveSpec[];
}
