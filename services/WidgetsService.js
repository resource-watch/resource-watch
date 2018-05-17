import queryString from 'query-string';

// Utils
import { get, post, remove } from 'utils/request';

export default class WidgetsService {
  constructor(options = {}) {
    this.opts = options;
  }

  static getAllWidgets(token, options) {
    const { filters } = options;
    const queryParams = queryString.stringify({
      application: process.env.APPLICATIONS,
      env: process.env.API_ENV,
      ...filters
    });

    return new Promise((resolve, reject) => {
      fetch(`${process.env.WRI_API_URL}/widget?${queryParams}`, {
        method: 'GET',
        headers: {
          Authorization: token,
          'Upgrade-Insecure-Requests': 1
        }
      })
        .then((response) => {
          const { status, statusText } = response;
          if (status === 200) return response.json();

          const errorObject = {
            errors: {
              status,
              details: statusText
            }
          };
          throw errorObject;
        })
        .then(data => resolve(data))
        .catch(errors => reject(errors));
    });
  }

  fetchData({ id, includes = '' }) {
    return new Promise((resolve, reject) => {
      const qParams = queryString.stringify({
        includes
      });
      get({
        url: `${process.env.WRI_API_URL}/widget/${id}?${qParams}`,
        headers: [{
          key: 'Content-Type',
          value: 'application/json'
        }, {
          key: 'Authorization',
          value: this.opts.authorization
        }, {
          key: 'Upgrade-Insecure-Requests',
          value: 1
        }],
        onSuccess: (response) => {
          resolve({
            ...response.data.attributes,
            id: response.data.id
          });
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }

  saveData({ type, body, id, dataset }) {
    return new Promise((resolve, reject) => {
      post({
        url: `${process.env.WRI_API_URL}/dataset/${dataset}/widget/${id}`,
        type,
        body,
        headers: [{
          key: 'Content-Type',
          value: 'application/json'
        }, {
          key: 'Authorization',
          value: this.opts.authorization
        }],
        onSuccess: (response) => {
          resolve({
            ...response.data.attributes,
            id: response.data.id
          });
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }

  saveMetadata({ type, body, id = '', dataset }) {
    return new Promise((resolve, reject) => {
      post({
        url: `${process.env.WRI_API_URL}/dataset/${dataset}/widget/${id}/metadata`,
        type,
        body,
        headers: [{
          key: 'Content-Type',
          value: 'application/json'
        }, {
          key: 'Authorization',
          value: this.opts.authorization
        }],
        onSuccess: (response) => {
          resolve({
            ...response.data.attributes,
            id: response.data.id
          });
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }

  deleteData({ id, dataset }) {
    return new Promise((resolve, reject) => {
      remove({
        url: `${process.env.WRI_API_URL}/dataset/${dataset}/widget/${id}`,
        headers: [{
          key: 'Authorization',
          value: this.opts.authorization
        }],
        onSuccess: () => {
          resolve();
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }

  /**
  * This method freezes a widget and returns the URL of the corresponding JSON
  * file that was created on the cloud
  */
  freezeWidget(sqlQuery) {
    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.WRI_API_URL}/query?sql=${sqlQuery}&freeze=true`,
        headers: [{
          key: 'Authorization',
          value: this.opts.authorization
        }, {
          key: 'Upgrade-Insecure-Requests',
          value: 1
        }],
        onSuccess: (response) => {
          resolve(response);
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }
}
