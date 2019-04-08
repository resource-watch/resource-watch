import 'isomorphic-fetch';
import flatten from 'lodash/flatten';
import sortBy from 'lodash/sortBy';
import { get, post, remove } from 'utils/request';
import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

export default class LayersService {
  constructor(options = {}) {
    this.opts = options;
  }

  fetchAllLayers({ applications }) {
    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.WRI_API_URL}/layer?application=${applications.join(',')}&includes=user&page[size]=99999`,
        headers: [{
          key: 'Content-Type',
          value: 'application/json'
        }, {
          key: 'Authorization',
          value: this.opts.authorization
        }, {
          key: 'Upgrade-Insecure-Requests',
          value: 1
        }],
        onSuccess: ({ data }) => {
          resolve(sortBy(data.map(d => ({ ...d.attributes, id: d.id })), 'name'));
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }

  // GET ALL DATA
  fetchAllData({ applications, dataset = '' }) {
    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.WRI_API_URL}/dataset/${dataset}?application=${applications.join(',')}&includes=layer,user&page[size]=9999`,
        headers: [{
          key: 'Content-Type',
          value: 'application/json'
        }, {
          key: 'Authorization',
          value: this.opts.authorization
        }, {
          key: 'Upgrade-Insecure-Requests',
          value: 1
        }],
        onSuccess: ({ data }) => {
          if (Array.isArray(data)) {
            const layers = flatten(data.map(d => d.attributes.layer.map(layer => ({
              ...layer.attributes,
              user: d.attributes.user,
              id: layer.id
            }))));
            resolve(sortBy(layers, 'name'));
          } else {
            const layers = data.attributes.layer.map(layer => ({
              ...layer.attributes,
              user: data.attributes.user,
              id: layer.id
            }));
            resolve(sortBy(layers, 'name'));
          }
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
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

  deleteData({ id, dataset }) {
    return new Promise((resolve, reject) => {
      remove({
        url: `${process.env.WRI_API_URL}/dataset/${dataset}/layer/${id}`,
        headers: [{
          key: 'Authorization',
          value: this.opts.authorization
        }],
        onSuccess: () => {
          resolve();
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }
}

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
    return WRISerializer({});
  });
};

