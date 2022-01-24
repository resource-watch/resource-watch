import { API_ENVS } from 'types';
import { APILayerSpec } from './layer';
import { APIWidgetSpec } from './widget';

export interface APIDatasetSpec {
  env: API_ENVS;
  id: string;
  layer?: APILayerSpec[];
  name: string;
  slug: string;
  type: 'dataset';
  widget?: APIWidgetSpec[];
}
