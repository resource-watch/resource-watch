import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

/**
 * Fetch partners according to params and headers.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#fetch-partners|here}
 * @param {Object} params - params sent to the API.
 * @param {Object} headers - headers sent to the API.
 * @returns {Object[]} array of serialized partners.
 */
export const fetchPartners = (params = {}, headers = {}) => {
  logger.info('Fetch partners');
  return WRIAPI.get('partner', {
    params: {
      ...params,
      env: process.env.API_ENV,
      application: process.env.APPLICATIONS,
    },
    headers: { ...headers },
  })
    .then((response) => WRISerializer(response.data))
    .catch((response) => {
      const { status, statusText } = response;
      logger.error(`Error fetching partners: ${status}: ${statusText}`);
      throw new Error(`Error fetching partners: ${status}: ${statusText}`);
    });
};

/**
 * Fetch the partner specified by the id parameter.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#fetch-partner|here}
 * @param {String} id - Partner ID.
 * @param {Object} params - params sent to the API.
 * @param {Object} headers - headers sent to the API.
 * @returns {Object} Partner object.
 */
export const fetchPartner = (id, params = {}, headers = {}) => {
  logger.info(`Fetch partner ${id}`);
  return WRIAPI.get(
    `partner/${id}`,
    {
      headers: { ...headers },
      params: {
        ...params,
        env: process.env.API_ENV,
        application: process.env.APPLICATIONS,
      },
    },
  )
    .then((response) => WRISerializer(response.data))
    .catch((response) => {
      const { status, statusText } = response;
      logger.error(`Error fetching partner ${id}: ${status}: ${statusText}`);
      throw new Error(`Error fetching partner ${id}: ${status}: ${statusText}`);
    });
};

/**
 * Update the partner specified by the id parameter.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#update-partner|here}
 * @param {String} id - Partner ID.
 * @param {Object} partner - Partner data.
 * @param {String} token - Authorization token.
 * @param {Object} params - params sent to the API.
 * @param {Object} headers - headers sent to the API.
 * @returns {Object} Partner object.
 */
export const updatePartner = (id, partner, token, params = {}, headers = {}) => {
  logger.info(`Update partner ${id}`);
  return WRIAPI.patch(`partner/${id}`,
    { ...partner },
    {
      params: { ...params },
      headers: { ...headers, Authorization: token },
    })
    .then((response) => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error updating partner ${id} ${status}: ${statusText}`);
      throw new Error(`Error updating partner ${id} ${status}: ${statusText}`);
    });
};

/**
 * Create a new partner.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#create-partner|here}
 * @param {Object} partner - Partner data.
 * @param {String} token - Authorization token.
 * @param {Object} params - params sent to the API.
 * @param {Object} headers - headers sent to the API.
 * @returns {Object} Partner object.
 */
export const createPartner = (partner, token, params = {}, headers = {}) => {
  logger.info('Create partner');
  return WRIAPI.post('partner',
    { ...partner },
    {
      params: {
        ...params,
        env: process.env.API_ENV,
        application: process.env.APPLICATIONS,
      },
      headers: { ...headers, Authorization: token },
    })
    .then((response) => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error creating partner ${status}: ${statusText}`);
      throw new Error(`Error creating partner ${status}: ${statusText}`);
    });
};

/**
 * Delete the partner specified in the ID parameter.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#delete-partner|here}
 * @param {String} id - Partner ID.
 * @param {String} token - Authorization token.
 * @param {Object} params - params sent to the API.
 * @param {Object} headers - headers sent to the API.
 */
export const deletePartner = (id, token, params = {}, headers = {}) => {
  logger.info(`Delete partner ${id}`);
  return WRIAPI.delete(
    `partner/${id}`,
    {
      params: {
        ...params,
        application: process.env.APPLICATIONS,
      },
      headers: {
        ...headers,
        Authorization: token,
      },
    },
  )
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error deleting partner: ${id} ${status}: ${statusText}`);
      throw new Error(`Error deleting partner: ${id} ${status}: ${statusText}`);
    });
};

export default {
  fetchPartners,
  fetchPartner,
  deletePartner,
  createPartner,
  updatePartner,
};
