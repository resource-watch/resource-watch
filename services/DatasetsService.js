import 'isomorphic-fetch';
import { get, post, remove } from 'utils/request';
import sortBy from 'lodash/sortBy';

export default class DatasetsService {

  constructor(options = {}) {
    this.opts = options;
  }

  // GET ALL DATA
  fetchAllData({ applications = [process.env.APPLICATIONS], includes, filters }) {
    const qParams = {
      application: applications.join(','),
      ...!!includes && includes,
      'page[size]': 9999999,
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

  fetchData({ id, applications = [process.env.APPLICATIONS], includes }) {
    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.WRI_API_URL}/dataset/${id}?application=${applications.join(',')}&includes=${includes}`,
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

  fetchFields({ id }) {
    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.WRI_API_URL}/fields/${id}`,
        headers: [{
          key: 'Content-Type',
          value: 'application/json'
        }, {
          key: 'Authorization',
          value: this.opts.authorization
        }],
        onSuccess: (data) => {
          resolve(Object.keys(data.fields).map(field => ({
            name: field,
            type: data.fields[field].type
          })));
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }
}
