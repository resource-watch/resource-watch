import 'isomorphic-fetch';
import { get, post, remove } from 'utils/request';

import sortBy from 'lodash/sortBy';
import { Deserializer } from 'jsonapi-serializer';

export default class ToolsService {
  constructor(options = {}) {
    this.opts = options;
  }

  // GET ALL DATA
  fetchAllData() {
    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.API_URL}/tools/?published=all`,
        headers: [{
          key: 'Content-Type',
          value: 'application/json'
        }, {
          key: 'Authorization',
          value: this.opts.authorization
        },
        {
          key: 'Upgrade-Insecure-Requests',
          value: 1
        }],
        onSuccess: (response) => {
          new Deserializer({
            keyForAttribute: 'underscore_case'
          }).deserialize(response, (err, tools) => {
            resolve(sortBy(tools, 'name'));
          });
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }

  fetchData(id) {
    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.API_URL}/tools/${id}`,
        headers: [{
          key: 'Content-Type',
          value: 'application/json'
        }, {
          key: 'Authorization',
          value: this.opts.authorization
        },
        {
          key: 'Upgrade-Insecure-Requests',
          value: 1
        }],
        onSuccess: (response) => {
          new Deserializer({
            keyForAttribute: 'underscore_case'
          }).deserialize(response, (err, tool) => {
            resolve(tool);
          });
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
        url: `${process.env.API_URL}/tools/${id}`,
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
          new Deserializer({
            keyForAttribute: 'underscore_case'
          }).deserialize(response, (err, tool) => {
            resolve(tool);
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
        url: `${process.env.API_URL}/tools/${id}`,
        headers: [{
          key: 'Authorization',
          value: this.opts.authorization
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
