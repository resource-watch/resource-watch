import 'isomorphic-fetch';
import flatten from 'lodash/flatten';
import sortBy from 'lodash/sortBy';

// Utils
import { get, post, remove } from 'utils/request';

export default class WidgetsService {
  constructor(options = {}) {
    this.opts = options;
  }

  // GET ALL DATA
  fetchAllData({ application = [process.env.APPLICATIONS], dataset = '', includes, filters }) {
    const qParams = {
      application: application.join(','),
      ...!!includes && { includes },
      'page[size]': 9999999,
      ...filters
    };

    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.WRI_API_URL}/dataset/${dataset}?${Object.keys(qParams).map(k => `${k}=${qParams[k]}`).join('&')}`,
        headers: [{
          key: 'Content-Type',
          value: 'application/json'
        }, {
          key: 'Authorization',
          value: this.opts.authorization
        }],
        onSuccess: ({ data }) => {
          if (Array.isArray(data)) {
            const widgets = flatten(data.map(d => d.attributes.widget.map(widget => ({
              ...widget.attributes,
              id: widget.id
            }))));

            resolve(sortBy(widgets, 'name'));
          } else {
            const widgets = data.attributes.widget.map(widget => ({
              ...widget.attributes,
              id: widget.id
            }));
            resolve(sortBy(widgets, 'name'));
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
        url: `${process.env.WRI_API_URL}/widget/${id}`,
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

  saveData({ type, body, id, dataset }) {
    return new Promise((resolve, reject) => {
      post({
        url: `${process.env.WRI_API_URL}/dataset/${dataset}/widget/${id}`,
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
        url: `${process.env.WRI_API_URL}/widget/${id}/metadata`,
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
        url: `${process.env.WRI_API_URL}/dataset/${dataset}/widget/${id}`,
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

  fetchCollections() {
    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.WRI_API_URL}/vocabulary/widget_collections?application=${process.env.APPLICATIONS}`,
        headers: [{
          key: 'Content-Type',
          value: 'application/json'
        }, {
          key: 'Authorization',
          value: this.opts.authorization
        }],
        onSuccess: ({ data }) => {
          const collections = flatten(data.map((d) => {
            return d.attributes.resources
              .filter(val => val.type === 'widget')
              .map(val => ({ id: val.id, tags: val.tags }))
              .filter(val => val.tags.find(tag => tag.includes(this.opts.user.id)));
          }));

          resolve(collections);
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }
}
