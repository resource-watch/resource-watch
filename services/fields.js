import axios from 'axios';

// utils
import { logger } from 'utils/logs';

/**
 * Fetches fields for a specific dataset.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#fields|here}
 * @param {String} url - URL to get fields.
 * @returns {Object} array of dataset fields.
 */
export const fetchFields = (url) => {
  if (!url) throw Error('an URL is mandatory to perform this fetching.');
  logger.info(`Fetches fields (${url})`);

  return axios.get(url, {
    headers: {
      ...axios.defaults.headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1,
    },
  })
    .then((response) => {
      const { status, statusText, data } = response;

      if (status >= 300) {
        if (status === 404) {
          logger.debug(`Fields for (${url}) not found, ${status}: ${statusText}`);
        } else {
          logger.error(`Error fetching fields for (${url}): ${status}: ${statusText}`);
        }
        throw new Error(statusText);
      }

      return data;
    })
    .catch(({ response }) => {
      const { status, statusText } = response;

      logger.error(`Error fetching fields for (${url}): ${status}: ${statusText}`);
      throw new Error(`Error fetching fields for (${url}): ${status}: ${statusText}`);
    });
};

/**
 * Fetches fields from CARTO datasets.
 * @param {Object} config - contains "account" and "sql" attributes to fetch CARTO fields.
 * @returns {Object} array of dataset fields.
 */
export const fetchCartoFields = (config = {}) => {
  const { account, sql } = config;
  if (!account) throw new Error('account attribute not found.');
  if (!sql) throw new Error('SQL attribute not found.');

  return axios.get(`https://${account}.carto.com/api/v2/sql?q=${sql} limit 0`, {
    headers: {
      ...axios.defaults.headers,
    },
  })
    .then(({ data }) => data)
    .catch(({ response }) => {
      const { data: { error } } = response;
      throw new Error(error[0] || 'Error fetching fields from CARTO');
    });
};
