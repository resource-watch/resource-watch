import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

/**
 * Fetches topics according to params.
 *
 * @param {Object[]} params - params sent to the API.
 * @returns {Object[]} array of serialized topics.
 */
export const fetchTopics = (params = {}) => {
  logger.info('Fetch topics');

  return WRIAPI.get('topic', {
    headers: {
      ...WRIAPI.defaults.headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1
    },
    params: {
      ...params,
      env: process.env.API_ENV,
      application: process.env.APPLICATIONS
    },
    transformResponse: (_data) => {
      let parsedData = { data: [] };

      try {
        parsedData = JSON.parse(_data);
      } catch ({ message }) {
        logger.error('Error parsing topics');
        throw new Error(message);
      }

      return parsedData.data.map(_topic => WRISerializer({ data: _topic }));
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
  });
};

/**
 * fetches data for a specific topic.
 *
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
      return data;
    }).catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error fetching topic: ${id}: ${status}: ${statusText}`);
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
export const createTopic = (body, token) => {
  logger.info('Create topic');
  return WRIAPI.post('topic', {
    /* this is a temporary hack TODO: change it once the endpoints have been fixed */
    data: { attributes: { ...body } },
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
      return data;
    });
};

/**
 * Updates a specified topic with the provided data.
 * This fetch needs authentication.
 *
 * @param {String} id - topic ID to be updated.
 * @param {Object} body - data provided to update the topic.
 * @param {String} token - user's token
 * @returns {Object} serialized topic with updated data
 */
export const updateTopic = (id, body, token) => {
  logger.info(`Update topic: ${id}`);
  return WRIAPI.patch(`/topic/${id}`, {
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
      return data;
    });
};

/**
 * Deletes a specified topic.
 * This fetch needs authentication.
 *
 * @param {*} id - topic ID to be deleted.
 * @param {string} token - user's token.
 * @returns {Object} fetch response.
 */
export const deleteTopic = (id, token) => {
  logger.info(`Delete topic: ${id}`);
  return WRIAPI.delete(`/topic/${id}`, {
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
};

export default {
  deleteTopic,
  updateTopic,
  createTopic,
  fetchTopic,
  fetchTopics
};
