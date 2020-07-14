import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

/**
 * Fetch pages
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#fetch-pages|here}
 * @param {Object} params Request paremeters.
 * @param {Object} headers Request headers.
 */
export const fetchPages = (token, params = {}, headers = {}) => {
  logger.info('Fetch pages');
  return WRIAPI.get(
    'static_page',
    {
      headers: {
        ...headers,
        Authorization: token
      },
      params: {
        published: 'all',
        application: process.env.APPLICATIONS,
        env: process.env.API_ENV,
        ...params
      }
    }
  )
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error fetching pages: ${status}: ${statusText}`);
      throw new Error(`Error fetching pages: ${status}: ${statusText}`);
    });
};

/**
 * Fetch page
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#fetch-page|here}
 * @param {String} id Page id.
 * @param {String} token Authentication token.
 * @param {Object} params Request paremeters.
 * @param {Object} headers Request headers.
 */
export const fetchPage = (id, token, params = {}, headers = {}) => {
  logger.info(`Fetch page ${id}`);
  return WRIAPI.get(
    `static_page/${id}`,
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
      logger.error(`Error fetching page ${id}: ${status}: ${statusText}`);
      throw new Error(`Error fetching page ${id}: ${status}: ${statusText}`);
    });
};

/**
 * Update page
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#update-page|here}
 * @param {Object} page Request page to be updated.
 * @param {Object} token Authentication token.
 */
export const updatePage = (page, token) => {
  logger.info(`Update page ${page.id}`);
  return WRIAPI.patch(`static_page/${page.id}`,
    { data: { attributes: { ...page } } }
    , { headers: { Authorization: token } })
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error updating page ${page.id}: ${status}: ${statusText}`);
      throw new Error(`Error updating page ${page.id}: ${status}: ${statusText}`);
    });
};

/**
 * Create a new page.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#create-a-page|here}
 * @param {Object} page Request page to be updated.
 * @param {Object} token Authentication token.
 */
export const createPage = (page, token) => {
  logger.info('Create page');
  return WRIAPI.post('static_page',
    {
      data: {
        application: process.env.APPLICATIONS,
        env: process.env.API_ENV,
        attributes: { ...page }
      }
    },
    { headers: { Authorization: token } })
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error creating page ${status}: ${statusText}`);
      throw new Error(`Error creating page ${status}: ${statusText}`);
    });
};

/**
 * Delete page
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#delete-page|here}
 * @param {String} id Page id.
 * @param {String} token Authentication token.
 * @param {Object} params Request paremeters.
 * @param {Object} headers Request headers.
 */
export const deletePage = (id, token, params = {}, headers = {}) => {
  logger.info(`Delete page ${id}`);
  return WRIAPI.delete(
    `static_page/${id}`,
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
      logger.error(`Error deleting page ${id}: ${status}: ${statusText}`);
      throw new Error(`Error deleting page ${id}: ${status}: ${statusText}`);
    });
};

export default {
  fetchPages,
  fetchPage,
  createPage,
  updatePage,
  deletePage
};
