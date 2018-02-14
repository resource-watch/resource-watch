import 'isomorphic-fetch';

import sortBy from 'lodash/sortBy';
import { Deserializer } from 'jsonapi-serializer';

export default class FaqsService {
  constructor(options = {}) {
    this.opts = options;
  }

  // GET ALL DATA
  fetchAllData() {
    return fetch(`${process.env.API_URL}/faqs/?published=all`)
      .then((response) => {
        const { status, statusText } = response;
        if (response.ok) return response.json();

        const errorObject = {
          errors: {
            status,
            details: statusText
          }
        };
        throw errorObject;
      })
      .then(response => new Deserializer({
        keyForAttribute: 'underscore_case'
      }).deserialize(response, (err, faqs) => sortBy(faqs, 'order')));
  }

  fetchData(id) {
    return fetch(`${process.env.API_URL}/faqs/${id}`)
      .then((response) => {
        const { status, statusText } = response;
        if (response.ok) return response.json();

        const errorObject = {
          errors: {
            status,
            details: statusText
          }
        };
        throw errorObject;
      })
      .then(response => new Deserializer({
        keyForAttribute: 'underscore_case'
      }).deserialize(response, (err, faq) => faq));
  }

  saveData({ type, body, id = '' }) {
    return fetch(`${process.env.API_URL}/faqs/${id}`, {
      method: type,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.opts.authorization
      }
    })
      .then((response) => {
        const { status, statusText } = response;
        if (response.ok) return response.json();

        const errorObject = {
          errors: {
            status,
            details: statusText
          }
        };
        throw errorObject;
      })
      .then(response => new Deserializer({
        keyForAttribute: 'underscore_case'
      }).deserialize(response, (err, faq) => faq));
  }

  deleteData(id) {
    return fetch(`${process.env.API_URL}/faqs/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.opts.authorization
      }
    })
      .then((response) => {
        const { status, statusText } = response;
        if (response.ok) return response;

        const errorObject = {
          errors: {
            status,
            details: statusText
          }
        };
        throw errorObject;
      });
  }

  updateFaqOrder(order, token) {
    return fetch(`${process.env.API_URL}/faqs/reorder`, {
      method: 'POST',
      body: JSON.stringify(order),
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    })
      .then((response) => {
        const { status, statusText } = response;
        if (response.ok) return response.json();

        const errorObject = {
          errors: {
            status,
            details: statusText
          }
        };
        throw errorObject;
      })
      .then(response => new Deserializer({
        keyForAttribute: 'underscore_case'
      }).deserialize(response, (err, faqs) => sortBy(faqs, 'order')));
  }
}
