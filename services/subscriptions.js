import { WRIAPI } from 'utils/axios';

/**
 *  Get Subscriptions
 */
export const getSubscriptions = token =>
  WRIAPI.get(`subscriptions?application=${process.env.APPLICATIONS}&env=${process.env.API_ENV}`,
    { headers: { Authorization: token } })
    .then(response => response.data.data);

export default {
  getSubscriptions
};
