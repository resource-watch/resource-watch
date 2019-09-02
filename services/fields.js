// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

// API docs: https://resource-watch.github.io/doc-api/index-rw.html#fields

/**
 * fetches fields for a specific dataset.
 *
 * @param {String} dataset - dataset id.
 * @param {string} token - user's token.
 * @returns {Object} array of dataset fields.
 */
export const getFields = (dataset, token) => {
  if (!dataset) throw Error('dataset id is mandatory to perform this fetching.');
  logger.info(`Fetches fields for dataset: ${dataset}`);

  return WRIAPI.get(`/fields/${dataset}`, {
    headers: {
      ...WRIAPI.defaults.headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1,
      Authorization: token
    }
  })
    .then((response) => {
      const { status, statusText, data } = response;

      if (status >= 300) {
        if (status === 404) {
          logger.debug(`Fields for dataset '${dataset}' not found, ${status}: ${statusText}`);
        } else {
          logger.error(`Error fetching fields for dataset: ${dataset}: ${status}: ${statusText}`);
        }
        throw new Error(statusText);
      }

      return data;
    })
    .catch(({ response }) => {
      const { status, statusText } = response;

      logger.error(`Error fetching fields for dataset ${dataset}: ${status}: ${statusText}`);
      throw new Error(`Error fetching fields for dataset ${dataset}: ${status}: ${statusText}`);
    });
};

export default { getFields };
