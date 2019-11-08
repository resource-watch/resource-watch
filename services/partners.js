import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';

import 'isomorphic-fetch';
import { get, post, remove } from 'utils/request';

import { Deserializer } from 'jsonapi-serializer';

// API docs: TBD

export default class PartnersService {
  constructor(options = {}) {
    this.opts = options;
  }

  fetchData(id) {
    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.WRI_API_URL}/partner/${id}?application=${process.env.APPLICATIONS}&env=${process.env.API_ENV}`,
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
          new Deserializer({ keyForAttribute: 'underscore_case' }).deserialize(response, (err, partner) => {
            resolve(partner);
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
        url: `${process.env.WRI_API_URL}/partner/${id}`,
        type,
        body: {
          ...body,
          env: process.env.API_ENV,
          application: [process.env.APPLICATIONS]
        },
        headers: [{
          key: 'Content-Type',
          value: 'application/json'
        }, {
          key: 'Authorization',
          value: this.opts.authorization
        }],
        onSuccess: (response) => {
          new Deserializer({ keyForAttribute: 'underscore_case' }).deserialize(response, (err, partner) => {
            resolve(partner);
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
        url: `${process.env.WRI_API_URL}/partner/${id}`,
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

/**
 * Fetchs partners according to params.
 *
 * @param {Object} params - params sent to the API.
 * @returns {Object[]} array of serialized partners.
 */
export const fetchPartners = (params = {}) =>
  WRIAPI.get('/partner', {
    params: {
      ...params,
      env: process.env.API_ENV,
      application: [process.env.APPLICATIONS]
    }
  })
    .then((response) => {
      const { status, statusText, data } = response;
      if (status > 200) throw new Error(statusText);
      return WRISerializer(data);
    });

/**
 * fetchs data for a specific partnet.
 *
 * @param {String} id - partnet id.
 * @returns {Object} serialized specified partnet.
 */
export const fetchPartner = id =>
  WRIAPI.get(`/partner/${id}?application=${process.env.APPLICATIONS}&env=${process.env.API_ENV}`, {
    headers: {
      ...WRIAPI.defaults.headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1
    }
  })
    .then((response) => {
      const { status, statusText, data } = response;
      if (status >= 400) throw new Error(statusText);
      return WRISerializer(data);
    });
