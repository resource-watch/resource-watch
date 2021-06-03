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
  return WRIAPI.get('/v1/partner', {
    params: {
      ...params,
      env: process.env.NEXT_PUBLIC_API_ENV,
      application: process.env.NEXT_PUBLIC_APPLICATIONS,
    },
    headers: { ...headers },
    // resolves only if the status code is less than 300
    validateStatus: (status) => status < 300,
  })
    .then((response) => {
      const { status, statusText, data } = response;
      logger.debug(`Fetched partners: ${status} - ${statusText}: ${JSON.stringify(data)}`);
      return WRISerializer(data);
    })
    .catch(({ response }) => {
      const { status, data } = response;
      throw new Error(`Error fetching partners: ${data?.errors[0]?.detail || 'Error not defined'} – ${status}`);
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
    `/v1/partner/${id}`,
    {
      headers: { ...headers },
      params: {
        ...params,
        env: process.env.NEXT_PUBLIC_API_ENV,
        application: process.env.NEXT_PUBLIC_APPLICATIONS,
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
  return WRIAPI.patch(`/v1/partner/${id}`,
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
  return WRIAPI.post('/v1/partner',
    { ...partner },
    {
      params: {
        ...params,
        env: process.env.NEXT_PUBLIC_API_ENV,
        application: process.env.NEXT_PUBLIC_APPLICATIONS,
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
    `/v1/partner/${id}`,
    {
      params: {
        ...params,
        application: process.env.NEXT_PUBLIC_APPLICATIONS,
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
