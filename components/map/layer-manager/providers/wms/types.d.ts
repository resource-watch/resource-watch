export interface WMSQueryParams {
  bbox: '{bbox-epsg-3857}';
  format: string;
  height: number;
  layers: string | string[];
  request: 'GetCapabilities' | 'GetMap' | 'GetFeatureInfo';
  service: 'WMS';
  srs: string;
  transparent: boolean;
  version: '1.0.0' | '1.1.0' | '1.1.1' | '1.3.0';
  width: number;
}
