import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

// API docs: https://resource-watch.github.io/doc-api/index-rw.html#dataset

/**
 * Fetchs datasets according to params.
 *
 * @param {Object[]} params - params sent to the API.
 * @returns {Object[]} array of serialized datasets.
 */
export const fetchDatasets = (params = {}, headers = {}, _meta = false) => {
  logger.info('Fetch datasets');
  return WRIAPI.get('/dataset', {
    headers: {
      ...WRIAPI.defaults.headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1,
      ...headers
    },
    params: {
      env: process.env.API_ENV,
      application: process.env.APPLICATIONS,
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
  logger.info(`Fetch dataset: ${id}`);

  return WRIAPI.get(`/dataset/${id}`, {
    headers: {
      ...WRIAPI.defaults.headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1
    },
    params: {
      ...params,
      application: [process.env.APPLICATIONS],
      env: process.env.API_ENV
    }
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
 * Deletes a specified dataset.
 * This fetch needs authentication.
 *
 * @param {*} id - dataset ID to be deleted.
 * @param {string} token - user's token.
 * @returns {Object} fetch response.
 */
export const deleteDataset = (id, token) => {
  logger.info(`Delete dataset: ${id}`);

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

export const createDataset = (token, params = {}, headers) => {
  logger.info('Create dataset');

  return WRIAPI.post('dataset',
    params,
    { headers: { Authorization: token, ...headers } })
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;

      logger.error(`Error creating dataset ${status}: ${statusText}`);
      throw new Error(`Error creating dataset ${status}: ${statusText}`);
    });
};

export const updateDataset = (id, token, params = {}) => {
  logger.info(`Update dataset: ${id}`);

  return WRIAPI.patch(`dataset/${id}`, params, { headers: { Authorization: token } })
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;

      logger.error(`Error updating dataset ${id}: ${status}: ${statusText}`);
      throw new Error(`Error updating dataset ${id}: ${status}: ${statusText}`);
    });
};

/**
 * Updates or creates a metadata object
 * This methods requires authentication.
 *
 * @param {string} type - one of the following: 'PATCH', 'POST'
 * @param {Object} data - metadata object
 * @param {*} id - dataset ID
 * @param {string} token - user's token.
 * @returns {Object} New or updated metadata object.
 */
export const saveMetadata = ({ type, data, id = '', token }) => {
  const headers = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    }
  };
  const url = `${process.env.WRI_API_URL}/dataset/${id}/metadata`;

  if (type === 'POST') {
    return WRIAPI.post(url, data, headers)
      .then(({ response }) => response.data)
      .catch(({ response }) => {
        const { status, statusText } = response;
        logger.error(`Error creating metadata for dataset ${id}: ${status}: ${statusText}`);
        throw new Error(`Error creating metadata for dataset ${id}: ${status}: ${statusText}`);
      });
  } else if (type === 'PATCH') {
    return WRIAPI.patch(url, data, headers)
      .then(({ response }) => response.data)
      .catch(({ response }) => {
        const { status, statusText } = response;
        logger.error(`Error saving metadata from dataset ${id}: ${status}: ${statusText}`);
        throw new Error(`Error saving metadata from dataset ${id}: ${status}: ${statusText}`);
      });
  }
};

export default {
  fetchDatasets,
  fetchDataset,
  deleteDataset,
  createDataset,
  updateDataset,
  saveMetadata
};

