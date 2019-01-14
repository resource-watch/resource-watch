import 'isomorphic-fetch';
import { get, post, remove } from 'utils/request';

import { WRIAPI } from 'utils/axios';
import WRISerializer from 'wri-json-api-serializer';

import sortBy from 'lodash/sortBy';
import { Deserializer } from 'jsonapi-serializer';

export const fetchDashboards = (params = {}, token) =>
  WRIAPI.get('/dashboard', {
    headers: {
      ...WRIAPI.defaults.headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1,
      Authorization: token
    },
    params: {
      env: process.env.API_ENV,
      ...Object.keys(params).reduce((x, y) => ({ ...x, ...params[y] }), {})
    },
    transformResponse: [].concat(
      WRIAPI.defaults.transformResponse,
      ({ data }) => data
    )
  })
    .then(data => WRISerializer(data))
    .catch(({ errors }) => errors);

export default class DashboardsService {
  constructor(options = {}) {
    this.opts = options;
  }

  // GET ALL DATA
  fetchAllData({ includes, filters, fields, env = process.env.API_ENV } = {}) {
    const qParams = {
      ...!!includes && { includes },
      ...filters,
      ...fields,
      env
    };
    const params = Object.keys(qParams).map(k => `${k}=${qParams[k]}`).join('&');

    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.API_URL}/dashboard/?${params}`,
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
        onSuccess: response => new Deserializer({ keyForAttribute: 'underscore_case' })
          .deserialize(response, (err, dashboards) => {
            resolve(sortBy(dashboards, 'name'));
          }),
        onError: (error) => {
          reject(error);
        }
      });
    });
  }

  fetchData({ id, env = process.env.API_ENV }) {
    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.WRI_API_URL}/dashboard/${id}?env=${process.env.API_ENV}`,
        headers: [{
          key: 'Upgrade-Insecure-Requests',
          value: 1
        }],
        onSuccess: response => new Deserializer({ keyForAttribute: 'underscore_case' })
          .deserialize(response, (err, dashboard) => {
            resolve(dashboard);
          }),
        onError: (error) => {
          reject(error);
        }
      });
    });
  }

  saveData({ type, body, id }) {
    return new Promise((resolve, reject) => {
      post({
        url: `${process.env.API_URL}/dashboard/${id}`,
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

  deleteData({ id, auth }) {
    return new Promise((resolve, reject) => {
      remove({
        url: `${process.env.API_URL}/dashboards/${id}`,
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
