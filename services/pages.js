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
 * Delete page
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#fetch-page|here}
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

// saveData({ type, body, id }) {
//   return new Promise((resolve, reject) => {
//     post({
//       url: `${process.env.WRI_API_URL}/static_page/${id}`,
//       type,
//       body: {
//         ...body,
//         application: [process.env.APPLICATIONS],
//         env: process.env.API_ENV
//       },
//       headers: [{
//         key: 'Content-Type',
//         value: 'application/json'
//       }, {
//         key: 'Authorization',
//         value: this.opts.authorization
//       }],
//       onSuccess: (response) => {
//         new Deserializer({ keyForAttribute: 'underscore_case' }).deserialize(response, (err, page) => {
//           resolve(page);
//         });
//       },
//       onError: (error) => {
//         reject(error);
//       }
//     });
//   });
// }

export default {
  fetchPages,
  fetchPage,
  // createPage,
  // updatePage,
  deletePage
};
