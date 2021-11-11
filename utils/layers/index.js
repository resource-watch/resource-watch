import {
  isNumber,
  groupBy,
} from 'lodash';
import { v4 as uuidv4 } from 'uuid';

// utils
import {
  getUserAreaLayer,
} from 'components/map/utils';

// constants
import {
  USER_AREA_LAYER_TEMPLATES,
} from 'components/map/constants';

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

export const getTilerUrl = (layer) => {
  if (!layer) throw new Error('layer required to generate tiler URL');
  return `${process.env.NEXT_PUBLIC_WRI_API_URL}/v1/layer/${layer.id}/tile/gee/{z}/{x}/{y}`;
};
/**
 *
 * @param {Object[]} layers - array of layers to group by dataset
 * @param {Object} layerParams - additional layer params to modify the layer specification
 * @param {boolean} forceActive - enforces the layer to be active regardless its configuration
 * @returns {Object[]} array of layers grouped by dataset
 */
export const getLayerGroups = (layers = [], layerParams = {}, forceActive = false) => {
  const layersByDataset = groupBy(layers, 'dataset');

  return Object.keys(layersByDataset).map((datasetKey) => ({
    id: datasetKey,
    visibility: true,
    layers: layersByDataset[datasetKey]
      .map((_layer) => ({
        ..._layer,
        active: forceActive || (layerParams?.[_layer.id]?.default || Boolean(_layer.default)),
        opacity: isNumber(layerParams?.[_layer.id]?.opacity) ? layerParams[_layer.id].opacity : 1,
        ..._layer?.layerConfig?.type === 'gee' && {
          layerConfig: {
            ..._layer.layerConfig,
            body: {
              ..._layer.layerConfig.body,
              url: getTilerUrl(_layer),
            },
          },
        },
      })),
  }));
};

export const getAoiLayer = (widget = {}, geostore, options = {}) => {
  if (!geostore) return null;

  const {
    layerParams,
  } = widget?.widgetConfig || {};

  const {
    minZoom,
  } = options;

  const {
    id,
    geojson,
    bbox,
  } = geostore;

  return ({
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
  });
};

export const getMaskLayer = (widget = {}, params = {}) => {
  const {
    mask,
    layerParams,
  } = widget?.widgetConfig?.paramsConfig || {};

  if (!mask) return null;

  return ({
    id: mask?.id || `${uuidv4()}-mask`,
    provider: 'cartodb',
    layerConfig: {
      ...mask,
    },
    params,
    opacity: layerParams?.mask?.opacity || 1,
  });
};
