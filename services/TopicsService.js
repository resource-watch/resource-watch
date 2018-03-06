import 'isomorphic-fetch';
import { get, post, remove } from 'utils/request';

import sortBy from 'lodash/sortBy';
import { Deserializer } from 'jsonapi-serializer';

export default class TopicsService {
  constructor(options = {}) {
    this.opts = options;
  }

  // GET ALL DATA
  fetchAllData({ includes, filters, fields } = {}) {
    const qParams = {
      ...!!includes && { includes },
      ...filters,
      ...fields
    };
    const params = Object.keys(qParams).map(k => `${k}=${qParams[k]}`).join('&');

    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.API_URL}/topics/?${params}`,
        headers: [{
          key: 'Content-Type',
          value: 'application/json'
        }, {
          key: 'Authorization',
          value: this.opts.authorization
        }],
        onSuccess: response => new Deserializer({
          keyForAttribute: 'underscore_case'
        }).deserialize(response, (err, topics) => {
          resolve(sortBy(topics, 'name'));
        }),
        onError: (error) => {
          reject(error);
        }
      });
    });
  }

  fetchData({ id }) {
    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.API_URL}/topics/${id}`,
        onSuccess: (response) => {
          new Deserializer({
            keyForAttribute: 'underscore_case'
          }).deserialize(response, (err, topic) => {
            resolve(topic);
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
        url: `${process.env.API_URL}/topics/${id}`,
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
          }).deserialize(response, (err, topic) => {
            resolve(topic);
          });
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }

  deleteData({ id, auth }) {
    return new Promise((resolve, reject) => {
      remove({
        url: `${process.env.API_URL}/topics/${id}`,
        headers: [{
          key: 'Authorization',
          value: auth || this.opts.authorization
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
