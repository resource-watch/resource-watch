import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

import 'isomorphic-fetch';

// API docs: TBD

export const fetchData = (id, token, headers = {}) => {
  logger.info('Fetch data');
  return WRIAPI.get(
    `partner/${id}?application=${process.env.APPLICATIONS}&env=${process.env.API_ENV}`,
    {
      headers: {
        ...headers,
        Authorization: token
      },
      params: {}
    }
  )
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error fetching partners: ${status}: ${statusText}`);
      throw new Error(`Error fetching partners: ${status}: ${statusText}`);
    });
};

export const updateData = (id, body, token) => {
  logger.info('Update data');
  return WRIAPI.patch(`partner/${id}?application=${process.env.APPLICATIONS}&env=${process.env.API_ENV}`,
    { ...body },
    { headers: { Authorization: token } })
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error Update data partner ${status}: ${statusText}`);
      throw new Error(`Error Update data partner ${status}: ${statusText}`);
    });
};

export const createData = (body, token) => {
  logger.info('Create data');
  return WRIAPI.post(`partner?application=${process.env.APPLICATIONS}&env=${process.env.API_ENV}`,
    { ...body },
    { headers: { Authorization: token } })
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error Create data partner ${status}: ${statusText}`);
      throw new Error(`Error Create data partner ${status}: ${statusText}`);
    });
};

export const deleteData = (id, token, headers = {}) => {
  logger.info('Delete data');
  return WRIAPI.delete(
    `partner/${id}?application=${process.env.APPLICATIONS}&env=${process.env.API_ENV}`,
    {
      headers: {
        ...headers,
        Authorization: token
      }
    }
  )
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error delete partners: ${status}: ${statusText}`);
      throw new Error(`Error delete partners: ${status}: ${statusText}`);
    });
};

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
