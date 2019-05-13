import 'isomorphic-fetch';
import { get, post } from 'utils/request';
import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

export default class LayersService {
  constructor(options = {}) {
    this.opts = options;
  }

  getColumns({ dataset }) {
    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.WRI_API_URL}/fields/${dataset}`,
        headers: [{
          key: 'Content-Type',
          value: 'application/json'
        }, {
          key: 'Authorization',
          value: this.opts.authorization
        }],
        onSuccess: (response) => {
          const fieldsObj = response.fields;

          const parsedData = {
            tableName: response.tableName,
            fields: ((fieldsObj && Object.keys(fieldsObj)) || []).map((fKey) => {
              const { type } = fieldsObj[fKey] || null;
              return { label: fKey || '', value: fKey || '', type };
            })
          };
          resolve({ ...parsedData });
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }

  saveData({ type, body, id, dataset }) {
    return new Promise((resolve, reject) => {
      post({
        url: `${process.env.WRI_API_URL}/dataset/${dataset}/layer/${id}`,
        type,
        body,
        headers: [{
          key: 'Content-Type',
          value: 'application/json'
        }, {
          key: 'Authorization',
          value: this.opts.authorization
        }],
        onSuccess: (response) => {
          resolve({
            ...response.data.attributes,
            id: response.data.id
          });
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }
}

/**
 * Fetchs layers according to params.
 *
 * @param {Object[]} params - params sent to the API.
 * @returns {Object[]} array of serialized layers.
 */
export const fetchLayers = (params = {}, _meta = false) => {
  logger.info('fetches layers');

  return WRIAPI.get('/layer', {
    headers: {
      ...WRIAPI.defaults.headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1
    },
    params: {
      env: process.env.API_ENV,
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
 *
 * @param {String} id - layer id.
 * @param {Object[]} params - params sent to the API.
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
 *
 * @param {*} id - layer ID to be deleted.
 * @param {string} token - user's token.
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
