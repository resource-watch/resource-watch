import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

import sortBy from 'lodash/sortBy';

/**
 * Fetch tools
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#fetch-tools|here}
 * @param {Object} params Request paremeters.
 * @param {Object} headers Request headers.
 */
export const fetchTools = (token, params = {}, headers = {}) => {
  logger.info('Fetch tools');
  return WRIAPI.get(
    'tool',
    {
      headers: {
        ...headers,
        Authorization: token
      },
      params: {
        published: 'all',
        application: process.env.APPLICATIONS,
        env: process.env.API_ENV,
        ...params
      }
    }
  )
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error fetching tools: ${status}: ${statusText}`);
      throw new Error(`Error fetching tools: ${status}: ${statusText}`);
    });
};


  fetchData(id) {
    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.WRI_API_URL}/tool/${id}?env=${process.env.API_ENV}&application=${process.env.APPLICATIONS}`,
        headers: [{
          key: 'Content-Type',
          value: 'application/json'
        }, {
          key: 'Authorization',
          value: this.opts.authorization
        },
        {
          key: 'Upgrade-Insecure-Requests',
          value: 1
        }],
        onSuccess: (response) => {
          new Deserializer({
            keyForAttribute: 'underscore_case'
          }).deserialize(response, (err, tool) => {
            resolve(tool);
          });
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }

  saveData({ type, body, id }) {
    return new Promise((resolve, reject) => {
      post({
        url: `${process.env.WRI_API_URL}/tool/${id}`,
        type,
        body: {
          ...body,
          env: process.env.API_ENV,
          application: process.env.APPLICATIONS
        },
        headers: [{
          key: 'Content-Type',
          value: 'application/json'
        }, {
          key: 'Authorization',
          value: this.opts.authorization
        }],
        onSuccess: (response) => {
          new Deserializer({
            keyForAttribute: 'underscore_case'
          }).deserialize(response, (err, tool) => {
            resolve(tool);
          });
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }

  deleteData(id) {
    return new Promise((resolve, reject) => {
      remove({
        url: `${process.env.WRI_API_URL}/tool/${id}`,
        headers: [{
          key: 'Authorization',
          value: this.opts.authorization
        }],
        onSuccess: (response) => {
          resolve(response);
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }


/**
 * Fetchs a specific tool.
 *
 * @param {String} id - tool id.
 * @returns {Object[]} tool serialized.
 */

export const fetchTool = id =>
  WRIAPI.get(`/tool/${id}?env=${process.env.API_ENV}&application=${process.env.APPLICATIONS}`)
    .then((response) => {
      const { status, statusText, data } = response;
      if (status >= 400) throw new Error(statusText);
      return WRISerializer(data);
    });


export default {
  fetchTools
  fetchTool,
  createTool,
  updateTool,
  deleteTool
}

