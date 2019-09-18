import { WRIAPI } from 'utils/axios';

/**
 *  Get Subscriptions
 */
export const getSubscriptions = token =>
  WRIAPI.get(`subscriptions?application=${process.env.APPLICATIONS}&env=${process.env.API_ENV}`, { headers: { Authorization: token } }).then(response => response.data.data);

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
    { headers: { Authorization: user.token } });
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
  const bodyObj = {
    application: process.env.APPLICATIONS,
    language: language || 'en',
    datasets,
    datasetsQuery
  };

  return WRIAPI.patch(`subscriptions/${subscriptionId}`,
    bodyObj,
    { headers: { Authorization: user.token } });
};

/**
 *  Get Subscription
 */
export const getSubscription = (subscriptionId, token) =>
  WRIAPI.get(`subscriptions/${subscriptionId}/data?application=${process.env.APPLICATIONS}&env=${process.env.API_ENV}`,
    { headers: { Authorization: token } })
    .then(response => response.data);

/**
 * Deletes a subscription
 * @param {subscriptionId} ID of the subscription that will be deleted
 * @param {token} User token
 * @returns {Promise}
 */
export const deleteSubscription = (subscriptionId, token) =>
  WRIAPI.delete(`subscriptions/${subscriptionId}`,
    { headers: { Authorization: token } });

export default {
  getSubscriptions,
  createSubscriptionToArea,
  updateSubscriptionToArea,
  getSubscription,
  deleteSubscription
};
