import { WRIAPI } from 'utils/axios';
import WRISerializer from 'wri-json-api-serializer';
import { logger } from 'utils/logs';

// API docs: https://resource-watch.github.io/doc-api/index-rw.html#dataset

/**
 * Fetchs datasets according to params.
 *
 * @param {Object[]} params - params sent to the API.
 * @returns {Object[]} array of serialized datasets.
 */
export const fetchDatasets = (params = {}) => {
  logger.info('fetches datasets');

  return WRIAPI.get('/dataset', {
    headers: {
      ...WRIAPI.defaults.headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1
    },
    params: {
      env: process.env.API_ENV,
      ...params
    }
  })
    .then((response) => {
      const { status, statusText, data } = response;
      if (status >= 300) {
        logger.error('Error fetching datasets:', `${status}: ${statusText}`);
        throw new Error(statusText);
      }
      return WRISerializer(data);
    })
    .catch(({ response }) => {
      const { status, statusText } = response;

      logger.error(`Error fetching datasets: ${status}: ${statusText}`);
      throw new Error(`Error fetching datasets: ${status}: ${statusText}`);
    });
};


/**
 * fetches data for a specific dataset.
 *
 * @param {String} id - dataset id.
 * @param {Object[]} params - params sent to the API.
 * @returns {Object} serialized specified dataset.
 */
export const fetchDataset = (id, params = {}) => {
  if (!id) throw Error('dataset id is mandatory to perform this fetching.');
  logger.info(`Fetches dataset: ${id}`);

  return WRIAPI.get(`/dataset/${id}`, {
    headers: {
      ...WRIAPI.defaults.headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1
    },
    params
  })
    .then((response) => {
      const { status, statusText, data } = response;

      if (status >= 300) {
        if (status === 404) {
          logger.debug(`Dataset '${id}' not found, ${status}: ${statusText}`);
        } else {
          logger.error(`Error fetching dataset: ${id}: ${status}: ${statusText}`);
        }
        throw new Error(statusText);
      }
      return WRISerializer(data);
    })
    .catch(({ response }) => {
      const { status, statusText } = response;

      logger.error(`Error fetching dataset ${id}: ${status}: ${statusText}`);
      throw new Error(`Error fetching dataset ${id}: ${status}: ${statusText}`);
    });
};

export default {
  fetchDatasets,
  fetchDataset
};

