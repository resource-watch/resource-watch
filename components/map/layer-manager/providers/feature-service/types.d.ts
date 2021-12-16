export interface FeatureServiceQueryParams {
  f: 'geojson';
  geometryType:
    | 'esriGeometryPoint'
    | 'esriGeometryMultipoint'
    | 'esriGeometryPolyline'
    | 'esriGeometryPolygon'
    | 'esriGeometryEnvelope';
  spatialRel:
    | 'esriSpatialRelIntersects'
    | 'esriSpatialRelContains'
    | 'esriSpatialRelCrosses'
    | 'esriSpatialRelEnvelopeIntersects'
    | 'esriSpatialRelIndexIntersects'
    | 'esriSpatialRelOverlaps'
    | 'esriSpatialRelTouches'
    | 'esriSpatialRelWithin'
    | 'esriSpatialRelRelation';
  returnGeometry: boolean;
  returnTrueCurves: boolean;
  returnIdsOnly: boolean;
  returnCountOnly: boolean;
  returnZ: boolean;
  returnM: boolean;
  returnDistinctValues: boolean;
  returnExtentOnly: boolean;
  where: string;
}
