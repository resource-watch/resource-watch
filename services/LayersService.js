import 'isomorphic-fetch';
import flatten from 'lodash/flatten';
import sortBy from 'lodash/sortBy';
import { get, post, remove } from 'utils/request';


export default class LayersService {
  constructor(options = {}) {
    this.opts = options;
  }

  fetchAllLayers({ applications }) {
    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.WRI_API_URL}/layer?application=${applications.join(',')}&includes=user&page[size]=99999`,
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
          resolve(sortBy(data.map(d => ({ ...d.attributes, id: d.id })), 'name'));
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }

  // GET ALL DATA
  fetchAllData({ applications, dataset = '' }) {
    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.WRI_API_URL}/dataset/${dataset}?application=${applications.join(',')}&includes=layer,user&page[size]=9999`,
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
          if (Array.isArray(data)) {
            const layers = flatten(data.map(d => d.attributes.layer.map(layer => ({
              ...layer.attributes,
              user: d.attributes.user,
              id: layer.id
            }))));
            resolve(sortBy(layers, 'name'));
          } else {
            const layers = data.attributes.layer.map(layer => ({
              ...layer.attributes,
              user: data.attributes.user,
              id: layer.id
            }));
            resolve(sortBy(layers, 'name'));
          }
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
        url: `${process.env.WRI_API_URL}/layer/${id}`,
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

  getColumns({ dataset }) {
    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.WRI_API_URL}/fields/${dataset}`,
        headers: [{
          key: 'Content-Type',
          value: 'application/json'
        }, {
          key: 'Authorization',
          value: this.opts.authorization
        }],
        onSuccess: (response) => {
          const fieldsObj = response.fields;

          const parsedData = {
            tableName: response.tableName,
            fields: ((fieldsObj && Object.keys(fieldsObj)) || []).map((fKey) => {
              const { type } = fieldsObj[fKey] || null;
              return { label: fKey || '', value: fKey || '', type };
            })
          };
          resolve({ ...parsedData });
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }

  saveData({
    type, body, id, dataset
  }) {
    return new Promise((resolve, reject) => {
      post({
        url: `${process.env.WRI_API_URL}/dataset/${dataset}/layer/${id}`,
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
        url: `${process.env.WRI_API_URL}/dataset/${dataset}/layer/${id}`,
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
}
