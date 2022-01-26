import type { FeatureCollection } from 'geojson';

export interface Geostore {
  geojson: FeatureCollection;
  hash: string;
  areaHa?: number;
  bbox: [number, number, number, number];
}
