import type { LayerModel, LayerSpec, Source, ProviderMaker } from '@vizzuality/layer-manager';
import omit from 'lodash/omit';

/**
 * Specify how to get the data and the layers for this provider
 * @param layerModel Instance of LayerModel
 * @param resolve Object
 * @param reject Function
 */
class GeeProviderMaker implements ProviderMaker {
  /**
   * REQUIRED
   * A name (key) for the provider.
   * Use the same name you will use in your layerSpec object.
   */
  public name = 'gee';

  private getTilerUrl = (layer: LayerSpec): string | Error => {
    if (!layer) throw new Error('layer required to generate tiler URL');
    return `${process.env.NEXT_PUBLIC_WRI_API_URL}/v1/layer/${layer.id}/tile/gee/{z}/{x}/{y}`;
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

export default GeeProviderMaker;
