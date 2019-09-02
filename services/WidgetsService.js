import queryString from 'query-string';

// Utils
import { get, post } from 'utils/request';

export default class WidgetsService {
  constructor(options = {}) {
    this.opts = options;
  }

  fetchData({ id, includes = '' }) {
    return new Promise((resolve, reject) => {
      const qParams = queryString.stringify({
        includes,
        env: process.env.API_ENV,
        application: process.env.APPLICATIONS
      });
      get({
        url: `${process.env.WRI_API_URL}/widget/${id}?${qParams}`,
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

  saveData({ type, body, id, dataset }) {
    return new Promise((resolve, reject) => {
      post({
        url: `${process.env.WRI_API_URL}/dataset/${dataset}/widget/${id}`,
        type,
        body: {
          ...body,
          ...type !== 'PATCH' && { application: [process.env.APPLICATIONS] }
        },
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

  saveMetadata({ type, body, id = '', dataset }) {
    return new Promise((resolve, reject) => {
      post({
        url: `${process.env.WRI_API_URL}/dataset/${dataset}/widget/${id}/metadata`,
        type,
        body: {
          ...body,
          ...type !== 'PATCH' && { application: process.env.APPLICATIONS }
        },
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

  /**
  * This method freezes a widget and returns the URL of the corresponding JSON
  * file that was created on the cloud
  */
  freezeWidget(sqlQuery, freeze = true) {
    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.WRI_API_URL}/query?sql=${sqlQuery}&freeze=${freeze}`,
        headers: [{
          key: 'Authorization',
          value: this.opts.authorization
        }, {
          key: 'Upgrade-Insecure-Requests',
          value: 1
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
