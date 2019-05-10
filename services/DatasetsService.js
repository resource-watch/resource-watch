import * as queryString from 'query-string';
import { get, post, remove } from 'utils/request';

import { getFieldUrl, getFields } from 'utils/datasets/fields';

class DatasetsService {
  static getAllDatasets(token, options) {
    const { filters, includes } = options;
    const queryParams = queryString.stringify({
      application: process.env.APPLICATIONS,
      env: process.env.API_ENV,
      ...filters,
      includes
    });

    return new Promise((resolve, reject) => {
      fetch(`${process.env.WRI_API_URL}/dataset?${queryParams}`, {
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
  constructor(options = {}) {
    if (!options.language) {
      throw new Error('options.language param is required.');
    }

    this.opts = options;
  }


  fetchData({ id, applications = [process.env.APPLICATIONS], includes, filters }) {
    const qParams = {
      application: applications.join(','),
      language: this.opts.language,
      includes,
      ...filters
    };

    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.WRI_API_URL}/dataset/${id}?${Object.keys(qParams).map(k => `${k}=${qParams[k]}`).join('&')}`,
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

  saveData({ type, body, id = '' }) {
    return new Promise((resolve, reject) => {
      post({
        url: `${process.env.WRI_API_URL}/dataset/${id}`,
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

  saveMetadata({ type, body, id = '' }) {
    return new Promise((resolve, reject) => {
      post({
        url: `${process.env.WRI_API_URL}/dataset/${id}/metadata`,
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

  deleteData(id) {
    return new Promise((resolve, reject) => {
      remove({
        url: `${process.env.WRI_API_URL}/dataset/${id}`,
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

  fetchFields({ id, provider, type, tableName }) {
    const url = getFieldUrl(id, provider, type, tableName);
    return new Promise((resolve, reject) => {
      get({
        url,
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
        onSuccess: (data) => {
          resolve(getFields(data, provider, type));
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }
}

export default DatasetsService;
