import { isNumber, groupBy } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

// utils
import { getUserAreaLayer } from 'components/map/utils';

// constants
import { USER_AREA_LAYER_TEMPLATES } from 'components/map/constants';
import { APIWidgetSpec } from 'types/widget';
import { APILayerSpec } from 'types/layer';
import { LayerGroup } from 'components/map/types';

// sorts layers based on an array of layer ids
export const sortLayers = (_layers = [], _layerOrder = []) => {
  if (!_layers.length || !_layerOrder.length) return _layers;

  const sortedLayers = [];
  // gets unpublished and disordered layers
  const restLayers = _layers.filter((_layer) => !_layerOrder.includes(_layer.id));

  // sets layers according layerOrder configuration
  _layerOrder.forEach((_order) => {
    const matchLayer = _layers.find((_layer) => _layer.id === _order);

    if (matchLayer) sortedLayers.push(matchLayer);
  });

  // merges both layer arrays to respect already ordered layers and others
  return [...sortedLayers, ...restLayers];
};

/**
 *
 * @param {Object[]} layers - array of layers to group by dataset
 * @param {Object} layerParams - additional layer params to modify the layer specification
 * @param {boolean} forceActive - enforces the layer to be active regardless its configuration
 * @returns {Object[]} array of layers grouped by dataset
 */
export const getLayerGroups = (
  layers = [],
  layerParams = {},
  forceActive = false,
): LayerGroup[] => {
  const layersByDataset = groupBy(layers, 'dataset');

  return Object.keys(layersByDataset).map((datasetKey) => ({
    id: datasetKey,
    visibility: true,
    visible: true,
    layers: layersByDataset[datasetKey].map((_layer) => ({
      ..._layer,
      active: forceActive || layerParams?.[_layer.id]?.default || Boolean(_layer.default),
      opacity: isNumber(layerParams?.[_layer.id]?.opacity) ? layerParams[_layer.id].opacity : 1,
    })),
  }));
};

export const getAoiLayer = (
  widget: Partial<APIWidgetSpec> = {},
  geostore,
  options: Record<string, string | number> = {},
) => {
  if (!geostore) return null;

  const { layerParams } = widget?.widgetConfig || {};

  const { minZoom } = options;

  const { id, geojson, bbox } = geostore;

  return {
    ...getUserAreaLayer(
      {
        id,
        geojson,
        minZoom,
      },
      USER_AREA_LAYER_TEMPLATES.explore,
    ),
    opacity: layerParams?.aoi?.opacity || 1,
    visibility: true,
    isAreaOfInterest: true,
    bbox,
  };
};

export const getMaskLayer = (widget: Partial<APIWidgetSpec> = {}, params = {}) => {
  const { mask, layerParams } = widget?.widgetConfig?.paramsConfig || {};

  if (!mask) return null;

  return {
    id: mask?.id || `${uuidv4()}-mask`,
    type: 'vector',
    layerConfig: {
      ...mask,
      params,
    },
    opacity: layerParams?.mask?.opacity || 1,
  };
};

export const getLayerAttributions = (layers: APILayerSpec[]): string => {
  return layers
    .filter(({ layerConfig }) => layerConfig?.body?.attribution || layerConfig.attribution)
    .map(({ layerConfig }) => layerConfig?.body?.attribution || layerConfig.attribution)
    .join(', ');
};
