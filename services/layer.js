import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

/**
 * Fetchs layers according to params.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#how-obtain-all-layers|here}
 * @param {Object} params - params sent to the API.
 * @param {Object} headers - headers sent to the API.
 * @param {boolean} _meta - should meta be in response or not
 * @returns {Object[]} array of serialized layers.
 */
export const fetchLayers = (params = {}, headers = {}, _meta = false) => {
  logger.info('fetches layers');

  return WRIAPI.get('/layer', {
    headers: {
      ...WRIAPI.defaults.headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1,
      ...headers
    },
    params: {
      env: process.env.API_ENV,
      application: process.env.APPLICATIONS,
      ...params
    },
    transformResponse: [].concat(
      WRIAPI.defaults.transformResponse,
      (({ data, meta }) => ({ layers: data, meta }))
    )
  })
    .then((response) => {
      const { status, statusText, data } = response;
      const { layers, meta } = data;

      if (status >= 300) {
        logger.error('Error fetching layers:', `${status}: ${statusText}`);
        throw new Error(statusText);
      }

      if (_meta) {
        return {
          layers: WRISerializer({ data: layers }),
          meta
        };
      }

      return WRISerializer({ data: layers });
    })
    .catch((response) => {
      const { status, statusText } = response;

      logger.error(`Error fetching layers: ${status}: ${statusText}`);
      throw new Error(`Error fetching layers: ${status}: ${statusText}`);
    });
};

/**
 * Fetches a layer according to widget id and params.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#how-obtain-specific-layers|here}
 * @param {String} id - layer id.
 * @param {Object} params - params sent to the API.
 * @returns {Object[]} - serialized specific layer.
 */
export const fetchLayer = (id, params = {}) => {
  if (!id) throw Error('layer id is mandatory to perform this fetching.');
  logger.info(`Fetches layer: ${id}`);

  return WRIAPI.get(`/layer/${id}`, {
    headers: {
      ...WRIAPI.defaults.headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1
    },
    params: {
      application: process.env.APPLICATIONS,
      env: process.env.API_ENV,
      ...params
    },
    transformResponse: [].concat(
      WRIAPI.defaults.transformResponse,
      ({ data }) => data
    )
  }).then((response) => {
    const { status, statusText, data } = response;

    if (status >= 300) {
      if (status === 404) {
        logger.debug(`Layer '${id}' not found, ${status}: ${statusText}`);
      } else {
        logger.error('Error fetching layer:', `${status}: ${statusText}`);
      }
      throw new Error(statusText);
    }
    return WRISerializer({ data });
  }).catch(({ response }) => {
    const { status, statusText } = response;
    logger.error('Error fetching layer:', `${status}: ${statusText}`);
    throw new Error('Error fetching layer:', `${status}: ${statusText}`);
  });
};

/**
 * Deletes a specified layer.
 * This fetch needs authentication.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#delete-a-layer|here}
 * @param {String} layerId - layer ID to be deleted.
 * @param {String} datasetId - dataset ID to be deleted.
 * @param {String} token - user's token.
 * @returns {Object} fetch response.
 */
export const deleteLayer = (layerId, datasetId, token) => {
  logger.info(`deletes layer: ${layerId}`);

  return WRIAPI.delete(`/dataset/${datasetId}/layer/${layerId}`, {
    headers: {
      ...WRIAPI.defaults.headers,
      Authorization: token
    }
  })
    .then((response) => {
      const { status, statusText } = response;

      if (status >= 300) {
        if (status === 404) {
          logger.debug(`Layer '${layerId}' not found, ${status}: ${statusText}`);
        } else {
          logger.error(`Error deleting layer: ${layerId}: ${status}: ${statusText}`);
        }
        throw new Error(statusText);
      }
      return response;
    })
    .catch(({ response }) => {
      const { status, statusText } = response;

      logger.error(`Error deleting layer ${layerId}: ${status}: ${statusText}`);
      throw new Error(`Error deleting layer ${layerId}: ${status}: ${statusText}`);
    });
};

/**
 * Updates the layer provided.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#update-a-layer|here}
 * @param {Object} layer - layer data.
 * @param {string} token - user's token.
 */
export const updateLayer = (layer, datasetId, token) => {
  logger.info(`Update layer: ${layer.id}`);
  return WRIAPI.patch(`dataset/${datasetId}/layer/${layer.id}`, layer, { headers: { Authorization: token } })
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error updating layer ${layer.id}: ${status}: ${statusText}`);
      throw new Error(`Error updating layer ${layer.id}: ${status}: ${statusText}`);
    });
};

/**
 * Creates a new layer.
 * This fetch needs authentication.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#create-a-layer|here}
 * @param {Object} layer - layer data.
 * @param {string} datasetId - Dataset ID the widget belongs to.
 * @param {string} token - user's token.
 */
export const createLayer = (layer, datasetId, token) => {
  logger.info('Create layer');
  return WRIAPI.post(`dataset/${datasetId}/layer`,
    {
      application: process.env.APPLICATIONS.split(','),
      env: process.env.API_ENV,
      ...layer
    },
    { headers: { Authorization: token } })
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error creating layer ${status}: ${statusText}`);
      throw new Error(`Error creating layer ${status}: ${statusText}`);
    });
};

export default {
  fetchLayers,
  fetchLayer,
  deleteLayer,
  createLayer,
  updateLayer
};
