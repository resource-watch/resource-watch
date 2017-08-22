import 'isomorphic-fetch';
import { get, post, remove } from 'utils/request';

import sortBy from 'lodash/sortBy';
import { Deserializer } from 'jsonapi-serializer';

export default class DashboardsService {
  constructor(options = {}) {
    this.opts = options;
  }

  // GET ALL DATA
  fetchAllData({ applications = [process.env.APPLICATIONS], includes, filters } = {}) {
    const qParams = {
      application: applications.join(','),
      ...!!includes && { includes },
      ...filters
    };

    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.API_URL}/api/dashboards/?${Object.keys(qParams).map(k => `${k}=${qParams[k]}`).join('&')}`,
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
          }).deserialize(response, (err, dashboards) => {
            resolve(sortBy(dashboards, 'name'));
          });
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
        url: `${process.env.API_URL}/api/dashboards/${id}`,
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
          }).deserialize(response, (err, dashboard) => {
            resolve(dashboard);
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
        url: `${process.env.API_URL}/api/dashboards/${id}`,
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
          }).deserialize(response, (err, dashboard) => {
            resolve(dashboard);
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
        url: `${process.env.API_URL}/api/dashboards/${id}`,
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
