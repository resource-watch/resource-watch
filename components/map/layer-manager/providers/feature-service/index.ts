import type { LayerModel, LayerSpec, Source, ProviderMaker } from '@vizzuality/layer-manager';
import { fetch } from '@vizzuality/layer-manager-utils';
import omit from 'lodash/omit';
import { FeatureServiceQueryParams } from './types';

// types
import type { GeoJSONSourceRaw } from 'mapbox-gl';

/**
 * Specify how to get the data and the layers for this provider
 * @param layerModel Instance of LayerModel
 * @param resolve Object
 * @param reject Function
 */
class FeatureServiceProviderMaker implements ProviderMaker {
  /**
   * REQUIRED
   * A name (key) for the provider.
   * Use the same name you will use in your layerSpec object.
   */
  public name = 'feature-service';

  private getGeoJSON = async (
    layer: LayerSpec,
    layerModel: LayerModel,
  ): Promise<GeoJSONSourceRaw> => {
    const { provider } = layer.source;

    const { tiler, ...restOptions } = provider.options;

    if (!tiler) throw new Error("An ArcGIS MapServer must be provided in the 'tiles' property");

    const params: FeatureServiceQueryParams = {
      f: 'geojson',
      geometryType: 'esriGeometryEnvelope',
      spatialRel: 'esriSpatialRelIntersects',
      returnGeometry: true,
      returnTrueCurves: false,
      returnIdsOnly: false,
      returnCountOnly: false,
      returnZ: false,
      returnM: false,
      returnDistinctValues: false,
      returnExtentOnly: false,
      where: '1=1',
      ...(restOptions || {}),
    };

    const geojson = await fetch('get', `${tiler}/query`, { params }, layerModel);

    return {
      type: 'geojson',
      data: geojson,
    };
  };

  public handleData = async (
    layerModel: LayerModel,
    layer: LayerSpec,
    resolve?: (layerSpec: LayerSpec) => void,
    reject?: (err: Error) => void,
  ): Promise<void> => {
    try {
      const result = {
        ...layer,
        source: {
          ...omit(layer.source, 'provider'),
        } as Source,
      };

      resolve({
        ...result,
        source: (await this.getGeoJSON(layer, layerModel)) as Source,
      });
    } catch (error) {
      reject(error.message);
    }
  };
}

export default FeatureServiceProviderMaker;
