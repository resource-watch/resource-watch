import 'isomorphic-fetch';
import { post, remove } from 'utils/request';

import { Deserializer } from 'jsonapi-serializer';
import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

export default class TopicsService {
  constructor(options = {}) {
    this.opts = options;
  }

  saveData({ type, body, id }) {
    return new Promise((resolve, reject) => {
      post({
        url: `${process.env.WRI_API_URL}/topic/${id}`,
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
          }).deserialize(response, (err, topic) => {
            resolve(topic);
          });
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }

  deleteData({ id, auth }) {
    return new Promise((resolve, reject) => {
      remove({
        url: `${process.env.WRI_API_URL}/topic/${id}?env=${process.env.API_ENV}&application=${process.env.APPLICATIONS}`,
        headers: [{
          key: 'Authorization',
          value: auth || this.opts.authorization
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
}

/**
 * Fetches topics according to params.
 *
 * @param {Object[]} params - params sent to the API.
 * @returns {Object[]} array of serialized topics.
 */
export const fetchTopics = (params = {}, headers = {}) => {
  logger.info('fetches topics');

  return WRIAPI.get('/topic', {
    headers: {
      ...WRIAPI.defaults.headers,
      ...headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1
    },
    params: {
      ...params,
      env: process.env.API_ENV,
      application: process.env.APPLICATIONS
    }
  }).then((response) => {
    const { status, statusText, data } = response;
    logger.debug(`Topics fetch returned with code ${status}`);

    if (status >= 300) {
      logger.error('Error fetching topics:', `${status}: ${statusText}`);
      throw new Error(statusText);
    }
    return data;
  }).catch(({ response }) => {
    const { status, statusText } = response;
    logger.error('Error fetching topics:', `${status}: ${statusText}`);
    throw new Error(response);
  });
};

/**
 * fetches data for a specific topic.
 *
 * @param {String} id - topic id.
 * @returns {Object} serialized specified topic.
 */
export const fetchTopic = (id) => {
  logger.info(`Fetches topic: ${id}`);

  return WRIAPI.get(`topic/${id}?env=${process.env.API_ENV}&application=${process.env.APPLICATIONS}`)
    .then((response) => {
      const { status, statusText, data } = response;
      if (status >= 300) {
        if (status === 404) {
          logger.debug(`Topic '${id}' not found, ${status}: ${statusText}`);
        } else {
          logger.error(`Error fetching topic: ${id}: ${status}: ${statusText}`);
        }
        throw new Error(statusText);
      }
      return data;
    }).catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error fetching topic: ${id}: ${status}: ${statusText}`);
      return (response);
    });
};


/**
 * Creates a topic with the provided data.
 * This fetch needs authentication.
 *
 * @param {Object} body - data provided to create the new topic.
 * @param {String} token - user's token.
 * @returns {Object} serialized created topic.
 */
export const createTopic = (body, token) =>
  WRIAPI.post('/topic', {
    ...body,
    env: process.env.API_ENV,
    application: process.env.APPLICATIONS
  }, {
    headers: {
      ...WRIAPI.defaults.headers,
      Authorization: token
    }
  })
    .then((response) => {
      const { status, statusText, data } = response;
      if (status >= 400) throw new Error(statusText);
      return WRISerializer(data);
    });

/**
 * Updates a specified topic with the provided data.
 * This fetch needs authentication.
 *
 * @param {String} id - topic ID to be updated.
 * @param {Object} body - data provided to update the topic.
 * @param {String} token - user's token
 * @returns {Object} serialized topic with updated data
 */
export const updateTopic = (id, body, token) =>
  WRIAPI.patch(`/topic/${id}`, {
    ...body,
    env: process.env.API_ENV,
    application: process.env.APPLICATIONS
  }, {
    headers: {
      ...WRIAPI.defaults.headers,
      Authorization: token
    }
  })
    .then((response) => {
      const { status, statusText, data } = response;
      if (status >= 400) {
        throw new Error(statusText);
      }
      return WRISerializer(data);
    });

/**
 * Deletes a specified topic.
 * This fetch needs authentication.
 *
 * @param {*} id - topic ID to be deleted.
 * @param {string} token - user's token.
 * @returns {Object} fetch response.
 */
export const deleteTopic = (id, token) =>
  WRIAPI.delete(`/topic/${id}`, {
    headers: {
      ...WRIAPI.defaults.headers,
      Authorization: token
    }
  })
    .then((response) => {
      const { status, statusText } = response;
      if (status >= 400) {
        console.warn(`deletes topic: ${id}:`, statusText);
        throw new Error(statusText);
      }
      return response;
    });
