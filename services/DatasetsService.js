import 'isomorphic-fetch';
import { get, post, remove } from 'utils/request';
import sortBy from 'lodash/sortBy';

import { getFieldUrl, getFields } from 'utils/datasets/fields';

export default class DatasetsService {
  constructor(options = {}) {
    this.opts = options;
  }

  // GET ALL DATA
  fetchAdminData({ applications = [process.env.APPLICATIONS], includes, filters } = {}) {
    const qParams = {
      application: applications.join(','),
      ...!!includes && { includes },
      'page[size]': 9999999,
      env: 'production,preproduction',
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

  fetchAllData({ applications = [process.env.APPLICATIONS], includes, filters, env = 'preproduction,production' } = {}) {
    const qParams = {
      application: applications.join(','),
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
