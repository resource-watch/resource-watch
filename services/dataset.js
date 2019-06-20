import WRISerializer from 'wri-json-api-serializer';

// Utils
import { WRIAPI } from 'utils/axios';
import { getFieldUrl, getFields } from 'utils/datasets/fields';
import { logger } from 'utils/logs';

// API docs: https://resource-watch.github.io/doc-api/index-rw.html#dataset

/**
 * Fetchs datasets according to params.
 *
 * @param {Object[]} params - params sent to the API.
 * @returns {Object[]} array of serialized datasets.
 */
export const fetchDatasets = (params = {}, headers = {}, _meta = false) => {
  logger.info('fetches datasets');

  return WRIAPI.get('/dataset', {
    headers: {
      ...WRIAPI.defaults.headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1,
      ...headers
    },
    params: {
      env: process.env.API_ENV,
      ...params
    },
    transformResponse: [].concat(
      WRIAPI.defaults.transformResponse,
      (({ data, meta }) => ({ datasets: data, meta }))
    )
  })
    .then((response) => {
      const { status, statusText, data } = response;
      const { datasets, meta } = data;

      if (status >= 300) {
        logger.error('Error fetching datasets:', `${status}: ${statusText}`);
        throw new Error(statusText);
      }

      if (_meta) {
        return {
          datasets: WRISerializer({ data: datasets }),
          meta
        };
      }

      return WRISerializer({ data: datasets });
    })
    .catch((response) => {
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

/**
 * Fetches fields for a specific dataset.
 *
 * @param {String} id - dataset id.
 * @param {String} provider - dataset provider.
 * @param {String} type - dataset type.
 * @param {String} provider - dataset table name.
 * @returns {Object} serialized specified dataset.
 */
export const fetchFields = ({ id, provider, type, tableName }) => {
  const url = getFieldUrl(id, provider, type, tableName);
  return WRIAPI.get(
    url,
    {
      headers: {
        ...WRIAPI.defaults.headers,
        // TO-DO: forces the API to not cache, this should be removed at some point
        'Upgrade-Insecure-Requests': 1
      }
    })
    .then((response) => {
      return getFields(response.data, provider, type);
    }).catch(({ response }) => {
      const { status, statusText } = response;

      logger.error(`Error fetching fields ${id}: ${status}: ${statusText}`);
      throw new Error(`Error fetching fields ${id}: ${status}: ${statusText}`);
    });
};


/**
 * Deletes a specified dataset.
 * This fetch needs authentication.
 *
 * @param {*} id - dataset ID to be deleted.
 * @param {string} token - user's token.
 * @returns {Object} fetch response.
 */
export const deleteDataset = (id, token) => {
  logger.info(`deletes dataset: ${id}`);

  return WRIAPI.delete(`/dataset/${id}`, {
    headers: {
      ...WRIAPI.defaults.headers,
      Authorization: token
    }
  })
    .then((response) => {
      const { status, statusText } = response;

      if (status >= 300) {
        if (status === 404) {
          logger.debug(`Dataset '${id}' not found, ${status}: ${statusText}`);
        } else {
          logger.error(`Error deleting dataset: ${id}: ${status}: ${statusText}`);
        }
        throw new Error(statusText);
      }
      return response;
    })
    .catch(({ response }) => {
      const { status, statusText } = response;

      logger.error(`Error deleting dataset ${id}: ${status}: ${statusText}`);
      throw new Error(`Error deleting dataset ${id}: ${status}: ${statusText}`);
    });
};

export default {
  fetchDatasets,
  fetchDataset,
  fetchFields,
  deleteDataset
};

