import type { LayerModel, LayerSpec, Source, ProviderMaker } from '@vizzuality/layer-manager';
import omit from 'lodash/omit';
import { WMSQueryParams } from './types';

export type RasterSource = Source & {
  tiles?: string[];
};

/**
 * Specify how to get the data and the layers for this provider
 * @param layerModel Instance of LayerModel
 * @param resolve Object
 * @param reject Function
 */
class WMSProviderMaker implements ProviderMaker {
  /**
   * REQUIRED
   * A name (key) for the provider.
   * Use the same name you will use in your layerSpec object.
   */
  public name = 'wms';

  private getTilerUrl = (layer: LayerSpec): string | Error => {
    const source: RasterSource = layer.source;

    if (!source.tiles) throw new Error("A WMS server must be provided in the 'tiles' property");

    const defaultParams: Pick<WMSQueryParams, 'bbox' | 'request' | 'service'> = {
      bbox: '{bbox-epsg-3857}',
      request: 'GetMap',
      service: 'WMS',
    };

    const baseURLTiler = new URL(source.tiles[0]);
    const baseURLSearch = new URLSearchParams(baseURLTiler.search);
    const baseURLParams = Object.fromEntries(baseURLSearch);

    const queryParams = new URLSearchParams({
      ...defaultParams,
      ...baseURLParams,
      ...(layer.source.provider?.options || {}),
    });

    return `${baseURLTiler.origin}${baseURLTiler.pathname}?${window.decodeURIComponent(
      queryParams.toString(),
    )}`;
  };

  public handleData = (
    layerModel: LayerModel,
    layer: LayerSpec,
    resolve?: (layerSpec: LayerSpec) => void,
    reject?: (err: Error) => void,
  ): void => {
    try {
      const result = {
        ...layer,
        source: {
          ...omit(layer.source, 'provider'),
          tiles: [this.getTilerUrl(layer)],
        } as Source,
      };
      resolve(result);
    } catch (error) {
      reject(error.message);
    }
  };
}

export default WMSProviderMaker;
