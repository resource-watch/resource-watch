import 'isomorphic-fetch';
import { get, post, remove } from 'utils/request';

import sortBy from 'lodash/sortBy';
import { Deserializer } from 'jsonapi-serializer';
import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

export default class TopicsService {
  constructor(options = {}) {
    this.opts = options;
  }

  // GET ALL DATA
  fetchAllData({ includes, filters, fields } = {}) {
    const qParams = {
      ...!!includes && { includes },
      ...filters,
      ...fields
    };
    const params = Object.keys(qParams).map(k => `${k}=${qParams[k]}`).join('&');

    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.WRI_API_URL}/topic/?${params}`,
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
        onSuccess: response => new Deserializer({
          keyForAttribute: 'underscore_case'
        }).deserialize(response, (err, topics) => {
          resolve(sortBy(topics, 'name'));
        }),
        onError: (error) => {
          reject(error);
        }
      });
    });
  }

  fetchData({ id }) {
    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.WRI_API_URL}/topic/${id}`,
        headers: [{
          key: 'Upgrade-Insecure-Requests',
          value: 1
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

  saveData({ type, body, id }) {
    return new Promise((resolve, reject) => {
      post({
        url: `${process.env.WRI_API_URL}/topic/${id}`,
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
        url: `${process.env.WRI_API_URL}/topic/${id}`,
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
export const fetchTopics = (params = {}) => {
  logger.info('Fetching topics');
  
  return WRIAPI.get('/topic', {
    headers: {
      ...WRIAPI.defaults.headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1
    },
    params
  }).then((response) => {
    const { status, statusText, data } = response;
    logger.debug(`Topics fetch returned with code ${status}`);

    if (status >= 300) {
      logger.error('Error fetching topics:', `${status}: ${statusText}`);
      throw new Error(statusText);
    }
    return WRISerializer(data);
  }).catch(({ response }) => {
    const { status, statusText } = response
    logger.error('Error fetching topics:', `${status}: ${statusText}`);
    return WRISerializer({});
  });
};

/**
 * fetches data for a specific topic.
 *
 * @param {String} id - topic id.
 * @returns {Object} serialized specified topic.
 */
export const fetchTopic = id => {
  logger.info(`Fetches topic: ${id}`);

  return WRIAPI.get(`/topic/${id}`)
    .then((response) => {
      const { status, statusText, data } = response;
      if (status >= 300) {
        logger.error(`Error fetching topic: ${id}: ${status}: ${statusText}`);
        throw new Error(statusText);
      }
      return WRISerializer(data);
    }).catch(({ response }) => {
      const { status, statusText } = response
      logger.error(`Error fetching topic: ${id}: ${status}: ${statusText}`);
      return WRISerializer({});
    });
}
  

/**
 * Creates a topic with the provided data.
 * This fetch needs authentication.
 *
 * @param {Object} body - data provided to create the new topic.
 * @param {String} token - user's token.
 * @returns {Object} serialized created topic.
 */
export const createTopic = (body, token) =>
  WRIAPI.post('/topic', { ...body }, {
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
  WRIAPI.patch(`/topic/${id}`, { ...body }, {
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
