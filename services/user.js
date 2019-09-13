import 'isomorphic-fetch';

export default class UserService {
  constructor(options) {
    if (!options) {
      throw new Error('options params is required.');
    }
    if (!options.apiURL || options.apiURL === '') {
      throw new Error('options.apiURL param is required.');
    }
    this.opts = options;
  }



  /**
   *  Get Subscription
   */
  getSubscription(subscriptionId, token) {
    return new Promise((resolve) => {
      fetch(`${this.opts.apiURL}/v1/subscriptions/${subscriptionId}/data?application=${process.env.APPLICATIONS}&env=${process.env.API_ENV}`, { headers: { Authorization: token } })
        .then(response => response.json())
        .then(jsonData => resolve(jsonData.data));
    });
  }

  /**
   * Deletes a subscription
   * @param {subscriptionId} ID of the subscription that will be deleted
   * @param {token} User token
   * @returns {Promise}
   */
  deleteSubscription(subscriptionId, token) {
    return fetch(`${this.opts.apiURL}/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
      headers: { Authorization: token }
    })
      .then(response => response.json());
  }
}
