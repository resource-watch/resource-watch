import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

/**
 * Get FAQs.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#get-faqs|here}
 * @param {Object} params Request paremeters.
 * @param {Object} headers Request headers.
 * @returns {Object}
 */
export const fetchFaqs = (params = {}, headers = {}) => {
  logger.info('Fetch FAQs');
  return WRIAPI.get(
    'faq',
    {
      params: {
        env: process.env.API_ENV,
        application: process.env.APPLICATIONS,
        ...params,
        published: 'all'
      },
      headers: { ...headers }
    }
  )
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error fetching faqs: ${status}: ${statusText}`);
      throw new Error(`Error fetching faqs: ${status}: ${statusText}`);
    });
};


/**
 * Get FAQ by its ID.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#get-faq|here}
 * @param {String} id FAQ id.
 * @param {Object} params Request paremeters.
 * @param {Object} headers Request headers.
 * @returns {Object}
 */
export const fetchFaq = (id, params = {}, headers = {}) => {
  logger.info(`Fetch FAQ - ${id}`);
  return WRIAPI.get(
    `faq/${id}`,
    {
      params: {
        env: process.env.API_ENV,
        application: process.env.APPLICATIONS,
        ...params
      },
      headers: { ...headers }
    }
  )
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error fetching faq ${id}: ${status}: ${statusText}`);
      throw new Error(`Error fetching faq ${id}: ${status}: ${statusText}`);
    });
};

/**
 * Delete FAQ
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#delete-faq|here}
 * @param {String} id - ID of the FAQ that will be deleted
 * @param {String} token - User token
 * @param {Object} params Request paremeters.
 * @param {Object} headers Request headers.
 */
export const deleteFaq = (id, token, params = {}, headers = {}) => {
  logger.info(`Delete FAQ ${id}`);
  return WRIAPI.delete(
    `faq/${id}`,
    {
      headers: {
        ...headers,
        Authorization: token
      },
      params: { ...params }
    }
  )
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error deleting faq ${id}: ${status}: ${statusText}`);
      throw new Error(`Error deleting faq ${id}: ${status}: ${statusText}`);
    });
};

/**
 * Update FAQ.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#update-faq|here}
 * @param {String} id - ID of the FAQ to be updated.
 * @param {String} faq - FAQ data.
 * @param {String} token - User token.
 * @param {Object} params - Request paremeters.
 * @param {Object} headers - Request headers.
 * @returns {Object}
 */
export const updateFaq = (id, faq, token, params = {}, headers = {}) => {
  logger.info(`Update FAQ ${id}`);
  return WRIAPI.patch(
    `faq/${id}`,
    { ...faq },
    {
      headers: {
        ...headers,
        Authorization: token
      },
      params: { ...params }
    }
  )
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error updating faq ${id}: ${status}: ${statusText}`);
      throw new Error(`Error updating faq ${id}: ${status}: ${statusText}`);
    });
};

/**
 * Create FAQ.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#create-faq|here}
 * @param {String} faq - FAQ data.
 * @param {String} token - User token.
 * @param {Object} params - Request paremeters.
 * @param {Object} headers - Request headers.
 * @returns {Object}
 */
export const createFaq = (faq, token, params = {}, headers = {}) => {
  logger.info('Create FAQ');
  return WRIAPI.post(
    'faq',
    { ...faq },
    {
      headers: {
        ...headers,
        Authorization: token
      },
      params: { ...params }
    }
  )
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error creating faq: ${status}: ${statusText}`);
      throw new Error(`Error creating faq: ${status}: ${statusText}`);
    });
};

/**
 * Reorder FAQ.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#reorder-faq|here}
 * @param {String} order - FAQs order.
 * @param {String} token - User token.
 * @param {Object} params - Request paremeters.
 * @param {Object} headers - Request headers.
 * @returns {Object}
 */
export const updateFaqOrder = (order, token, params = {}, headers = {}) => {
  logger.info('Reorder FAQ');
  return WRIAPI.post(
    'faq/reorder',
    { ...order },
    {
      headers: {
        ...headers,
        Authorization: token
      },
      params: { ...params }
    }
  )
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error updating faq order: ${status}: ${statusText}`);
      throw new Error(`Error updating faq order: ${status}: ${statusText}`);
    });
};
