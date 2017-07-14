import 'isomorphic-fetch';
import { get, post, remove } from 'utils/request';


export default class DatasetsService {

  constructor(options = {}) {
    this.opts = options;
  }

  // GET ALL DATA
  fetchAllData({ applications, includes }) {
    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.WRI_API_URL}/dataset?application=${applications.join(',')}&includes=${includes}&page[size]=${Date.now() / 100000}`,
        headers: [{
          key: 'Content-Type',
          value: 'application/json'
        }, {
          key: 'Authorization',
          value: this.opts.authorization
        }],
        onSuccess: ({ data }) => {
          resolve(data.map(dataset => ({ ...dataset.attributes, id: dataset.id })));
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }

  fetchData({ id }) {
    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.WRI_API_URL}/dataset/${id}`,
        headers: [{
          key: 'Content-Type',
          value: 'application/json'
        }, {
          key: 'Authorization',
          value: this.opts.authorization
        }],
        onSuccess: (response) => {
          resolve(response.data);
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }

  saveData({ type, body, id }) {
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
          resolve(response.data);
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }

  deleteData({ id }) {
    return new Promise((resolve, reject) => {
      remove({
        url: `${process.env.WRI_API_URL}/dataset/${id}`,
        headers: [{
          key: 'Authorization',
          value: this.opts.authorization
        }],
        onSuccess: (response) => {
          resolve(response.data);
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
