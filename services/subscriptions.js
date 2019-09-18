// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

/**
 *  Get Subscriptions
 */
export const fetchSubscriptions = (token) => {
  logger.info('Fetch subscriptions');
  return WRIAPI.get(`subscriptions?application=${process.env.APPLICATIONS}&env=${process.env.API_ENV}`,
    { headers: { Authorization: token } })
    .then(response => response.data.data)
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error fetching subscriptions: ${status}: ${statusText}`);
      throw new Error(`Error fetching subscriptions: ${status}: ${statusText}`);
    });
};

/**
 * Creates a subscription for a pair of dataset and country
 * @param {datasetID} ID of the dataset
 * @param {object} Either { type; 'iso', id:'ESP' } or { type: 'geostore', id: 'sakldfa7ads0ka'}
 * @param {string} language Two-letter locale
 * @returns {Promise}
 */
export const createSubscriptionToArea = (
  areaId,
  datasets,
  datasetsQuery,
  user,
  language,
  name = ''
) => {
  logger.info(`Create subscription to area: ${areaId}`);
  const bodyObj = {
    name,
    application: process.env.APPLICATIONS,
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
 *  Update Subscription
 */
export const updateSubscriptionToArea = (
  subscriptionId,
  datasets,
  datasetsQuery,
  user,
  language
) => {
  logger.info(`Update subscription: ${subscriptionId}`);
  const bodyObj = {
    application: process.env.APPLICATIONS,
    language: language || 'en',
    datasets,
    datasetsQuery
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
 *  Get Subscription
 */
export const fetchSubscription = (subscriptionId, token) => {
  logger.info(`Fetch subscription: ${subscriptionId}`);
  return WRIAPI.get(`subscriptions/${subscriptionId}/data?application=${process.env.APPLICATIONS}&env=${process.env.API_ENV}`,
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
 * @param {subscriptionId} ID of the subscription that will be deleted
 * @param {token} User token
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
