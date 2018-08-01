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
          Authorization: token,
          'Upgrade-Insecure-Requests': 1
        }
      })
        .then(response => resolve(response.json()));
    });
  }

  /**
  * Updates the user that is currently logged in
  */
  updateUser(user, token) {
    return fetch(`${this.opts.apiURL}/auth/user/me`, {
      method: 'PATCH',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    })
      .then(response => response.json());
  }

  /**
   * Gets the widgets that have been starred/favourited by the user that is
   * currently logged
   * @param {token} User token
   * @returns {Promise}
   */
  getFavouriteWidgets(token) {
    return this.setFavourites(token, 'widget', true);
  }

  /**
   * Gets the datasets that have been starred/favourited by the user that is
   * currently logged
   * @param {token} User token
   * @returns {Promise}
   */
  getFavouriteDatasets(token) {
    return this.setFavourites(token, 'dataset', true);
  }

  /**
   * Gets the contents that have been starred/favourited by the user that is
   * currently logged
    * @param {token} User token
   * @returns {Promise}
   */
  setFavourites(token, resourceType = null, include = true) {
    const resourceTypeSt = (resourceType !== null) ? `&resource-type=${resourceType}` : '';
    return fetch(`${this.opts.apiURL}/favourite?include=${include}${resourceTypeSt}&application=${process.env.APPLICATIONS}`, {
      headers: {
        Authorization: token,
        'Upgrade-Insecure-Requests': 1
      }
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
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
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      });
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
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      });
  }

  /**
   * Creates a subscription for a pair of dataset and country
   * @param {datasetID} ID of the dataset
   * @param {object} Either { type; 'iso', id:'ESP' } or { type: 'geostore', id: 'sakldfa7ads0ka'}
   * @param {string} language Two-letter locale
   * @returns {Promise}
   */
  createSubscriptionToArea(areaId, datasets, datasetsQuery, user, language, name = '') {
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
      params: {
        area: areaId
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
   *  Update Subscription
   */
  updateSubscriptionToArea(subscriptionId, datasets, datasetsQuery, user, language) {

    const bodyObj = {
      application: process.env.APPLICATIONS,
      language: language || 'en',
      datasets,
      datasetsQuery
    };

    return fetch(`${this.opts.apiURL}/subscriptions/${subscriptionId}`, {
      method: 'PATCH',
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
      fetch(`${this.opts.apiURL}/subscriptions?application=${process.env.APPLICATIONS}`, {
        headers: {
          Authorization: token
        }
      })
        .then(response => response.json())
        .then(jsonData => resolve(jsonData.data));
    });
  }

  /**
   *  Get Subscription
   */
  getSubscription(subscriptionId, token) {
    return new Promise((resolve) => {
      fetch(`${this.opts.apiURL}/v1/subscriptions/${subscriptionId}/data`, {
        headers: {
          Authorization: token
        }
      })
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
      headers: {
        Authorization: token
      }
    })
      .then(response => response.json());
  }

  /**
   * Get user areas
   */
  getUserAreas(token) {
    return new Promise((resolve, reject) => {
      fetch(`${this.opts.apiURL}/area?application=${process.env.APPLICATIONS}`, {
        headers: {
          Authorization: token,
          'Upgrade-Insecure-Requests': 1
        }
      })
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error(response.statusText);
        })
        .then(jsonData => resolve(jsonData.data))
        .catch(err => reject(err.message));
    });
  }

  /**
   * Create new area
   */
  createNewArea(name, geostore, token) {
    const bodyObj = {
      name,
      application: process.env.APPLICATIONS,
      geostore
    };

    return fetch(`${this.opts.apiURL}/area`, {
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
  * Update area
  */
  updateArea(id, name, token) {
    const bodyObj = {
      name,
      application: process.env.APPLICATIONS
    };

    return fetch(`${this.opts.apiURL}/area/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(bodyObj),
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    })
      .then(response => response.json());
  }

  /**
   * Deletes an area
   * @param {areaId} ID of the area that will be deleted
   * @param {token} User token
   * @returns {Promise}
   */
  deleteArea(areaId, token) {
    return fetch(`${this.opts.apiURL}/area/${areaId}`, {
      method: 'DELETE',
      headers: {
        Authorization: token
      }
    });
  }

  /**
   * Get area
   */
  getArea(id, token) {
    return fetch(`${this.opts.apiURL}/area/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        'Upgrade-Insecure-Requests': 1
      }
    })
      .then(response => response.json());
  }

  uploadPhoto(file, user) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const bodyObj = {
          data: {
            attributes: {
              user_id: user.id,
              avatar: reader.result
            }
          }
        };

        return fetch(`${process.env.API_URL}/profiles`, {
          method: 'POST',
          body: JSON.stringify(bodyObj),
          headers: {
            'Content-Type': 'application/json',
            Authorization: user.token
          }
        })
          .then(response => response.json())
          .then(({ data }) => {
            resolve(data.attributes.avatar.original);
          });
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  }
}
