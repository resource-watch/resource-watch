import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

/**
 * Get Subscriptions
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#obtain-the-subscriptions-for-a-user|here}
 * @param {String} token User's token
 * @param {Object} params request paremeters to API.
 */
export const fetchSubscriptions = (token, params) => {
  logger.info('Fetch subscriptions');
  return WRIAPI.get('subscriptions', {
    headers: {
      ...WRIAPI.defaults.headers,
      Authorization: token
    },
    params: {
      application: process.env.APPLICATIONS,
      env: process.env.API_ENV,
      ...params
    }
  })
    .then((response) => {
      const { status, statusText, data } = response;

      if (status >= 300) {
        logger.error('Error fetching subscriptions:', `${status}: ${statusText}`);
        throw new Error(statusText);
      }

      return WRISerializer(data);
    })
    .catch(({ response = {} }) => {
      const { status, statusText } = response;
      logger.error(`Error fetching subscriptions: ${status}: ${statusText}`);
      throw new Error(`Error fetching subscriptions: ${status}: ${statusText}`);
    });
};

/**
 * Creates a subscription for an area
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#with-an-area|here}
 * @param {Object} options
 */
export const createSubscriptionToArea = ({
  areaId,
  datasets,
  datasetsQuery,
  user,
  language,
  name = ''
}) => {
  logger.info(`Create subscription to area: ${areaId}`);
  const bodyObj = {
    name,
    application: process.env.APPLICATIONS,
    env: process.env.API_ENV,
    language: language || 'en',
    datasets,
    datasetsQuery,
    resource: {
      type: 'EMAIL',
      content: user.email
    },
    params: { area: areaId }
  };

  return WRIAPI.post('subscriptions',
    bodyObj,
    { headers: { Authorization: user.token } })
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error creating subscription to area ${areaId}: ${status}: ${statusText}`);
      throw new Error(`Error creating subscription to area ${areaId}: ${statusText}`);
    });
};

/**
 * Update Subscription
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#modify-subscription|here}
 * @param {String} subscriptionId
 * @param {*} datasets
 * @param {*} datasetsQuery
 * @param {Object} user
 * @param {String} language
 * @param {String} areaId
 */
export const updateSubscriptionToArea = (
  subscriptionId,
  datasets,
  datasetsQuery,
  user,
  language,
  areaId
) => {
  logger.info(`Update subscription: ${subscriptionId}`);
  const bodyObj = {
    application: process.env.APPLICATIONS,
    env: process.env.API_ENV,
    language: language || 'en',
    datasets,
    datasetsQuery,
    resource: {
      type: 'EMAIL',
      content: user.email
    },
    params: { area: areaId }
  };

  return WRIAPI.patch(`subscriptions/${subscriptionId}`,
    bodyObj,
    { headers: { Authorization: user.token } })
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error updating subscription ${subscriptionId}: ${status}: ${statusText}`);
      throw new Error(`Error updating subscription ${subscriptionId}: ${statusText}`);
    });
};

/**
 * Get Subscription
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#get-a-subscription-by-its-id|here}
 * @param {String} subscriptionId
 * @param {String} token User's token
 */
export const fetchSubscription = (subscriptionId, token) => {
  logger.info(`Fetch subscription: ${subscriptionId}`);
  return WRIAPI.get(`subscriptions/${subscriptionId}?application=${process.env.APPLICATIONS}&env=${process.env.API_ENV}`,
    { headers: { Authorization: token } })
    .then(response => response.data)
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error fetching subscription ${subscriptionId}: ${status}: ${statusText}`);
      throw new Error(`Error fetching subscription ${subscriptionId}: ${statusText}`);
    });
};

/**
 * Deletes a subscription
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#delete-subscription|here}
 * @param {String} subscriptionId of the subscription that will be deleted
 * @param {Strign} token User's token
 * @returns {Promise}
 */
export const deleteSubscription = (subscriptionId, token) => {
  logger.info(`Delete subscription: ${subscriptionId}`);
  return WRIAPI.delete(`subscriptions/${subscriptionId}`,
    { headers: { Authorization: token } })
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error deleting subscription ${subscriptionId}: ${status}: ${statusText}`);
      throw new Error(`Error deleting subscription ${subscriptionId}: ${statusText}`);
    });
};

export default {
  fetchSubscriptions,
  createSubscriptionToArea,
  updateSubscriptionToArea,
  fetchSubscription,
  deleteSubscription
};
