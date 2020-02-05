import 'isomorphic-fetch';
import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

import sortBy from 'lodash/sortBy';
import { Deserializer } from 'jsonapi-serializer';

export const fetchAllData = (headers = {}) => {
  logger.info('Fetch all data - faqs');
  return WRIAPI.get(
    `faq/?published=all&env=${process.env.API_ENV}&application=${process.env.APPLICATIONS}`,
    {
      headers: {
        ...headers,
        'Upgrade-Insecure-Requests': 1
      }
    }
  )
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error fetching faqs: ${status}: ${statusText}`);
      throw new Error(`Error fetching faqs: ${status}: ${statusText}`);
    });
};

export const fetchData = (id, headers = {}) => {
  logger.info(`Fetch faq data - ${id}`);
  return WRIAPI.get(
    `faq/${id}?env=${process.env.API_ENV}&application=${process.env.APPLICATIONS}`,
    {
      headers: {
        ...headers,
        'Upgrade-Insecure-Requests': 1
      }
    }
  )
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error fetching faq: ${status}: ${statusText}`);
      throw new Error(`Error fetching faq: ${status}: ${statusText}`);
    });
};

export const deleteData = (id, token, headers = {}) => {
  logger.info(`Delete faq data - ${id}`);
  return WRIAPI.delete(
    `faq/${id}?env=${process.env.API_ENV}&application=${process.env.APPLICATIONS}`,
    {
      headers: {
        ...headers,
        'Upgrade-Insecure-Requests': 1,
        Authorization: token
      }
    }
  )
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error fetching faq: ${status}: ${statusText}`);
      throw new Error(`Error fetching faq: ${status}: ${statusText}`);
    });
};
export const updateData = (id, body, token, headers = {}) => {
  logger.info(`Update faq data - ${id}`);
  return WRIAPI.patch(
    `faq/${id}?env=${process.env.API_ENV}&application=${process.env.APPLICATIONS}`,
    { ...body },
    {
      headers: {
        ...headers,
        'Upgrade-Insecure-Requests': 1,
        Authorization: token
      }
    }
  )
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error updating faq: ${status}: ${statusText}`);
      throw new Error(`Error updating faq: ${status}: ${statusText}`);
    });
};
export const createData = (body, token, headers = {}) => {
  logger.info('Create faq data');
  return WRIAPI.post(
    `faq/?env=${process.env.API_ENV}&application=${process.env.APPLICATIONS}`,
    { ...body },
    {
      headers: {
        ...headers,
        'Upgrade-Insecure-Requests': 1,
        Authorization: token
      }
    }
  )
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error create faq: ${status}: ${statusText}`);
      throw new Error(`Error create faq: ${status}: ${statusText}`);
    });
};

export default class FaqsService {
  constructor(options = {}) {
    this.opts = options;
  }

  // GET ALL DATA
  fetchAllData() {
    return fetch(
      `${process.env.WRI_API_URL}/faq/?published=all&env=${process.env.API_ENV}&application=${process.env.APPLICATIONS}`,
      { headers: { 'Upgrade-Insecure-Requests': 1 } }

    )
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
      .then(response => new Deserializer({ keyForAttribute: 'underscore_case' }).deserialize(response, (err, faqs) => sortBy(faqs, 'order')));
  }

  fetchData(id) {
    return fetch(
      `${process.env.WRI_API_URL}/faq/${id}`,
      { headers: { 'Upgrade-Insecure-Requests': 1 } }

    )
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
      .then(response => new Deserializer({ keyForAttribute: 'underscore_case' }).deserialize(response, (err, faq) => faq));
  }

  saveData({ type, body, id = '' }) {
    return fetch(`${process.env.WRI_API_URL}/faq/${id}`, {
      method: type,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'Upgrade-Insecure-Requests': 1,
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
      .then(response => new Deserializer({ keyForAttribute: 'underscore_case' }).deserialize(response, (err, faq) => faq));
  }

  deleteData(id) {
    return fetch(`${process.env.WRI_API_URL}/faq/${id}`, {
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
    return fetch(`${process.env.WRI_API_URL}/faq/reorder`, {
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
      .then(response => new Deserializer({ keyForAttribute: 'underscore_case' }).deserialize(response, (err, faqs) => sortBy(faqs, 'order')));
  }
}
