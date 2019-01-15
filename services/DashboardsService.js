import 'isomorphic-fetch';
import { post } from 'utils/request';

import { WRIAPI } from 'utils/axios';
import WRISerializer from 'wri-json-api-serializer';
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
    }
  })
    .then((response) => {
      const { status, statusText, data } = response;
      if (status >= 400) throw new Error(statusText);
      return WRISerializer(data);
    });

export const fetchDashboard = id =>
  WRIAPI.get(`/dashboard/${id}`, {
    headers: {
      ...WRIAPI.defaults.headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1
    },
    params: { env: process.env.API_ENV }
  })
    .then((response) => {
      const { status, statusText, data } = response;
      if (status >= 400) throw new Error(statusText);
      return WRISerializer(data);
    });


export const cloneDashboard = (id, token) =>
  WRIAPI.post(`/topics/${id}/clone-dashboard`, {}, {
    headers: {
      ...WRIAPI.defaults.headers,
      Authorization: token
    }
  })
    .then((response) => {
      const { status, statusText, data } = response;
      if (status >= 400) throw new Error(statusText);
      return WRISerializer(data);
    });

export const deleteDashboard = (id, token) =>
  WRIAPI.delete(`/dashboard/${id}`, {
    headers: {
      ...WRIAPI.defaults.headers,
      Authorization: token
    }
  })
    .then((response) => {
      const { status, statusText, data } = response;
      if (status >= 400) throw new Error(statusText);
      return data;
    });

export default class DashboardsService {
  constructor(options = {}) {
    this.opts = options;
  }

  // TO-DO: move to axios
  saveData({ type, body, id }) {
    return new Promise((resolve, reject) => {
      post({
        url: `${process.env.WRI_API_URL}/dashboard/${id}`,
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
}
