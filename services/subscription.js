import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

// API docs: https://resource-watch.github.io/doc-api/index-rw.html#subscriptions

/**
 * Fetches user's subscriptions.
 * @param {String} token - user's token.
 * @param {Object[]} params - params sent to the API.
 * @returns {Object[]} array of serialized subscriptions.
 */
export const fetchSubscriptions = (token, params = {}) => {
  logger.info('Fetches user subscriptions');

  return WRIAPI.get('/subscriptions', {
    headers: {
      ...WRIAPI.defaults.headers,
      Authorization: token
    },
    params
  })
    .then((response) => {
      const { status, statusText, data } = response;

      if (status >= 300) {
        logger.error(`Error fetching user subscriptions: ${status}: ${statusText}`);
        throw new Error(statusText);
      }
      return WRISerializer(data);
    })
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error fetching user subscriptions: ${status}: ${statusText}`);
      return WRISerializer({});
    });
};

/**
 * fetchs data for a specific user subscription.
 *
 * @param {String} id - subscription id.
 * @param {String} token - user's token.
 * @returns {Object} serialized specified subscription.
 */
export const fetchSubscription = (id, token) => {
  if (!id) throw Error('subscription id is mandatory to perform this fetching.');
  if (!token) throw Error('this fetching is authenticated, user token is mandatory.');

  logger.info(`Fetches user subscription: ${id}`);

  return WRIAPI.get(`/subscriptions/${id}/data`, {
    headers: {
      ...WRIAPI.defaults.headers,
      Authorization: token
    }
  })
    .then((response) => {
      const { status, statusText, data } = response;

      if (status >= 300) {
        if (status === 404) {
          logger.debug(`User subscription '${id}' not found, ${status}: ${statusText}`);
        } else {
          logger.error(`Error fetching user subscritpion: ${id}: ${status}: ${statusText}`);
        }
        throw new Error(statusText);
      }
      return WRISerializer(data);
    })
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error fetching user subscritpion ${id}: ${status}: ${statusText}`);
      return WRISerializer({});
    });
};

export default {
  fetchSubscriptions,
  fetchSubscription
};
