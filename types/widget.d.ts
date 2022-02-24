import type { Basemap, Labels } from 'components/map/types';
import type { MaskLayer } from 'types/layer';
export type WidgetTypes = 'widget' | 'map' | 'embed' | 'text' | 'chart' | 'map-swipe' | 'ranking';

export interface EmbedSource {
  src: string;
}

export interface LayerParams {
  [key: string]: Record<string, string | number | unknown>;
}

export interface WidgetParamsConfig {
  embed?: EmbedSource;
  layer?: string;
  layers?: string[];
  layerParams?: LayerParams;
  // used to define the layers of a map-swipe widget
  layersLeft?: string[];
  layersRight?: string[];
  visualizationType: WidgetTypes;
  mask?: MaskLayer;
}

export interface WidgetBasemapLayers {
  basemap?: Basemap;
  labels?: Labels;
  boundaries?: boolean;
}

export interface WidgetConfig {
  basemapLayers?: WidgetBasemapLayers;
  bbox?: [number, number, number, number];
  bounds?: number[];
  paramsConfig?: WidgetParamsConfig;
  layerParams?: LayerParams;
  type?: WidgetTypes;
  url?: string;
  data?: Record<string, string | number | unknown>[];
  layer_id?: string;
}

export interface WidgetLink {
  name: string;
  link: string;
}

export interface WidgetMetadataInfo {
  caption?: string;
  widgetLinks?: WidgetLink[];
}
export interface WidgetMetadata {
  language?: string;
  info?: WidgetMetadataInfo;
}

export interface APIWidgetSpec {
  id: string;
  name: string;
  dataset: string;
  slug: string;
  description?: string;
  application: string[];
  type?: string;
  userId: string;
  iso: string[];
  provider: string;
  userId: string;
  default: boolean;
  protected: boolean;
  published: boolean;
  verified: boolean;
  freeze: boolean;
  env: string;
  template: boolean;
  defaultEditableWidget: boolean;
  widgetConfig: WidgetConfig;
  source?: string;
  sourceUrl?: string;
  authors?: string;
  thumbnailUrl?: string;
  metadata?: WidgetMetadata[];
  createdAt: string;
  updatedAt: string;
}
