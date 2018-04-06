import * as queryString from 'query-string';
import { get, post, remove } from 'utils/request';
import sortBy from 'lodash/sortBy';

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

  // GET ALL DATA
  fetchAdminData({ applications = [process.env.APPLICATIONS], includes, filters } = {}) {
    const qParams = {
      application: applications.join(','),
      language: this.opts.language,
      ...!!includes && { includes },
      'page[size]': 9999999,
      env: process.env.API_ENV,
      ...filters
    };

    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.WRI_API_URL}/dataset?${Object.keys(qParams).map(k => `${k}=${qParams[k]}`).join('&')}`,
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
        onSuccess: ({ data }) => {
          const datasets = data.map(dataset => ({ ...dataset.attributes, id: dataset.id }));
          resolve(sortBy(datasets, 'name'));
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }

  fetchAllData({ applications = [process.env.APPLICATIONS], includes, filters, env = process.env.API_ENV } = {}) {
    const qParams = {
      application: applications.join(','),
      language: this.opts.language,
      ...!!includes && { includes },
      'page[size]': 9999999,
      ...filters,
      env
    };

    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.WRI_API_URL}/dataset?${Object.keys(qParams).map(k => `${k}=${qParams[k]}`).join('&')}`,
        headers: [{
          key: 'Content-Type',
          value: 'application/json'
        }, {
          key: 'Authorization',
          value: this.opts.authorization
        }],
        onSuccess: ({ data }) => {
          const datasets = data.map(dataset => ({ ...dataset.attributes, id: dataset.id }));
          resolve(sortBy(datasets, 'name'));
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
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
