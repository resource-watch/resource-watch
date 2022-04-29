import type { APILayerSpec } from './layer';
import type { APIWidgetSpec } from './widget';
import type { APIDatasetSpec } from './dataset';
import type { Collection } from './collection';
import type { Favorite } from './favorite';

declare global {
  interface Window {
    WEBSHOT_READY: boolean;
    GA_INITIALIZED: boolean;
  }
}

export type API_ENVS = 'staging' | 'preproduction' | 'production';

export type RESOURCE_TYPES = 'dataset' | 'layer' | 'widget';

export type ANY_RESOURCE = APIDatasetSpec | APILayerSpec | APIWidgetSpec | Collection | Favorite;
