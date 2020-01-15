import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

/**
 * Fetches topics according to params.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#getting-all-topics|here}
 * @param {Object} params - params sent to the API.
 * @param {Object} headers- headers sent to the API.
 * @returns {Object[]} array of serialized topics.
 */
export const fetchTopics = (params = {}, headers = {}) => {
  logger.info('Fetch topics');

  return WRIAPI.get('topic', {
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
    return WRISerializer(data);
  }).catch(({ response }) => {
    const { status, statusText } = response;
    logger.error('Error fetching topics:', `${status}: ${statusText}`);
  });
};

/**
 * Fetches data for a specific topic.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#getting-all-topics|here}
 * @param {String} id - topic id.
 * @returns {Object} serialized specified topic.
 */
export const fetchTopic = (id) => {
  logger.info(`Fetch topic: ${id}`);

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
      return WRISerializer(data);
    }).catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error fetching topic: ${id}: ${status}: ${statusText}`);
    });
};


/**
 * Creates a topic with the provided data.
 * This fetch needs authentication.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#topic|here}
 * @param {Object} body - data provided to create the new topic.
 * @param {String} token - user's token.
 * @returns {Object} serialized created topic.
 */
export const createTopic = (body, token) => {
  logger.info('Create topic');
  return WRIAPI.post('topic', {
    data: {
      env: process.env.API_ENV,
      application: process.env.APPLICATIONS,
      attributes: { ...body }
    }
  }, {
    headers: {
      ...WRIAPI.defaults.headers,
      Authorization: token
    }
  })
    .then((response) => {
      const { status, statusText, data } = response;
      if (status >= 300) {
        logger.error('Error creating topic:', statusText);
        throw new Error(statusText);
      }
      return WRISerializer(data);
    });
};

/**
 * Updates a specified topic with the provided data.
 * This fetch needs authentication.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#topic|here}
 * @param {String} id - topic ID to be updated.
 * @param {Object} body - data provided to update the topic.
 * @param {String} token - user's token
 * @returns {Object} serialized topic with updated data
 */
export const updateTopic = (id, body, token) => {
  logger.info(`Updates topic ${id}`);
  return WRIAPI.patch(`/topic/${id}`, {
    data: {
      env: process.env.API_ENV,
      application: process.env.APPLICATIONS,
      attributes: { ...body }
    }
  }, {
    headers: {
      ...WRIAPI.defaults.headers,
      Authorization: token
    }
  })
    .then((response) => {
      const { status, statusText, data } = response;
      if (status >= 300) {
        if (status !== 404) logger.error(`Error upadting topic ${id}:`, statusText);
        throw new Error(statusText);
      }
      return WRISerializer(data);
    });
};

/**
 * Deletes a specified topic.
 * This fetch needs authentication.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#topic|here}
 * @param {String} id - topic ID to be deleted.
 * @param {String} token - user's token.
 * @returns {Object} fetch response.
 */
export const deleteTopic = (id, token) => {
  logger.info(`Deletes topic ${id}`);
  return WRIAPI.delete(`/topic/${id}`, {
    headers: {
      ...WRIAPI.defaults.headers,
      Authorization: token
    }
  })
    .then((response) => {
      const { status, statusText } = response;
      if (status >= 300) {
        if (status !== 404) logger.error(`Error deleting topic ${id}:`, statusText);
        throw new Error(statusText);
      }
      return response;
    });
};

export default {
  deleteTopic,
  updateTopic,
  createTopic,
  fetchTopic,
  fetchTopics
};
