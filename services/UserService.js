import 'isomorphic-fetch';
import Promise from 'bluebird';

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
   * Gets the user that is currently logged
   * @returns {Promise}
   */
  getLoggedUser(token) {
    return new Promise((resolve) => {
      fetch(`${this.opts.apiURL}/auth/check-logged`, {
        headers: {
          Authorization: token
        }
      })
        .then(response => response.json())
        .then(jsonData => resolve(jsonData.data));
    });
  }

  /**
   * Gets the contents that have been starred/favourited by the user that is
   * currently logged
   * @param {token} User token
   * @returns {Promise}
   */
  getFavouriteWidgets(token) {
    return this.getFavourites(token, 'widget', true);
  }

  /**
   * Gets the contents that have been starred/favourited by the user that is
   * currently logged
    * @param {token} User token
   * @returns {Promise}
   */
  getFavourites(token, resourceType = null, include = true) {
    const resourceTypeSt = (resourceType !== null) ? `&resourceType=${resourceType}` : '';
    return new Promise((resolve) => {
      fetch(`${this.opts.apiURL}/favourite?include=${include}${resourceTypeSt}`, {
        headers: {
          Authorization: token
        }
      })
        .then(response => response.json())
        .then(jsonData => resolve(jsonData.data));
    });
  }

  /**
   * Deletes a favourite
   * @param {resourceId} ID of the resource that will be unfavourited
   * @param {token} User token
   * @returns {Promise}
   */
  deleteFavourite(resourceId, token) {
    return fetch(`${this.opts.apiURL}/favourite/${resourceId}`, {
      method: 'DELETE',
      headers: {
        Authorization: token
      }
    })
    .then(response => response.json());
  }

  /**
   * Creates a new favourite for a widget
   * @param {widgetId} Widget ID
   * @param {token} User token
   * @returns {Promise}
   */
  createFavouriteWidget(widgetId, token) {
    return this.createFavourite('widget', widgetId, token);
  }

  /**
   * Creates a new favourite for a resource
   * @param {resourceType} Type of the resource (dataset|layer|widget)
   * @param {resourceId} Resource ID
   * @param {token} User token
   * @returns {Promise}
   */
  createFavourite(resourceType, resourceId, token) {
    const bodyObj = {
      resourceType,
      resourceId
    };
    return fetch(`${this.opts.apiURL}/favourite`, {
      method: 'POST',
      body: JSON.stringify(bodyObj),
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    })
    .then(response => response.json());
  }

  /**
   * Creates a subscription for a pair of dataset and country
   * @param {datasetID} ID of the dataset
   * @param {countryISO} ISO of the country
   * @returns {Promise}
   */
  createSubscriptionToDataset(datasetID, countryISO, user, name = '') {
    const bodyObj = {
      name,
      application: 'rw',
      language: 'en',
      datasets: [datasetID],
      resource: {
        type: 'EMAIL',
        content: user.email
      },
      params: {
        iso: {
          country: countryISO
        }
      }
    };
    return fetch(`${this.opts.apiURL}/subscriptions`, {
      method: 'POST',
      body: JSON.stringify(bodyObj),
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      }
    })
    .then(response => response.json());
  }

  /**
   *  Get Subscriptions
   */
  getSubscriptions(token) {
    return new Promise((resolve) => {
      fetch(`${this.opts.apiURL}/subscriptions`, {
        headers: {
          Authorization: token
        }
      })
        .then(response => response.json())
        .then(jsonData => resolve(jsonData.data));
    });
  }
}
