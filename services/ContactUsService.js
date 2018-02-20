import 'isomorphic-fetch';

import { Deserializer } from 'jsonapi-serializer';

export default class ContactUsService {
  saveData({ body }) {
    return fetch(`${process.env.API_URL}/contact-us/`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
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
      })
      .then(response => new Deserializer({
        keyForAttribute: 'underscore_case'
      }).deserialize(response, (err, message) => message));
  }
}

