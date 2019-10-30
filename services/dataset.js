import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

// API docs: https://resource-watch.github.io/doc-api/index-rw.html#dataset

/**
 * Fetchs datasets according to params.
 * @param {Object} params Request paremeters.
 * @param {Object} headers Request headers.
 * @param {boolean} _meta Boolean flag indicating whether the meta object should
 * @returns {Array} Array of serialized datasets.
 * be included in the response or not.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#getting-all-datasets|here}
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
    params: { ...params }
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
* Get dataset tags
*/
export const fetchDatasetTags = (datasetId, params = {}) => {
  logger.info(`Fetch dataset tags: ${datasetId}`);
  return WRIAPI.get(`dataset/${datasetId}/vocabulary`,
    {
      headers: { 'Upgrade-Insecure-Requests': 1 },
      params: { ...params }
    })
    .then(response => WRISerializer(response.data))
    .catch((response) => {
      const { status, statusText } = response;
      logger.error(`Error fetching dataset tags ${datasetId}: ${status}: ${statusText}`);
      throw new Error(`Error fetching dataset tags ${datasetId}: ${status}: ${statusText}`);
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
* Update dataset tags
*/
export const updateDatasetTags = (datasetId, tags, token, usePatch = false) => {
  logger.info(`Update dataset tags: ${datasetId}`);

  if (usePatch) {
    return WRIAPI.patch(`dataset/${datasetId}/vocabulary/knowledge_graph`,
      {
        tags,
        application: process.env.APPLICATIONS,
        env: process.env.API_ENV
      },
      { headers: { Authorization: token } })
      .then(response => WRISerializer(response.data))
      .catch((response) => {
        const { status, statusText } = response;
        logger.error(`Error updating dataset tags ${datasetId}: ${status}: ${statusText}`);
        throw new Error(`Error updating dataset tags ${datasetId}: ${status}: ${statusText}`);
      });
  }
  if (tags.length > 0) {
    return WRIAPI.post(`dataset/${datasetId}/vocabulary`,
      {
        knowledge_graph: {
          tags,
          application: process.env.APPLICATIONS,
          env: process.env.API_ENV
        }
      },
      { headers: { Authorization: token } })
      .then(response => WRISerializer(response.data))
      .catch((response) => {
        const { status, statusText } = response;
        logger.error(`Error updating dataset tags ${datasetId}: ${status}: ${statusText}`);
        throw new Error(`Error updating dataset tags ${datasetId}: ${status}: ${statusText}`);
      });
  }
  return WRIAPI.delete(`dataset/${datasetId}/vocabulary/knowledge_graph`,
    {
      headers: { Authorization: token },
      params: {
        application: process.env.APPLICATIONS,
        env: process.env.API_ENV
      }
    })
    .then(response => WRISerializer(response.data))
    .catch((response) => {
      const { status, statusText } = response;
      logger.error(`Error updating dataset tags ${datasetId}: ${status}: ${statusText}`);
      throw new Error(`Error updating dataset tags ${datasetId}: ${status}: ${statusText}`);
    });
};

/**
 * Creates a metadata object in the specified dataset
 * This methods requires authentication.
 *
 * @param {*} datasetId - dataset ID where the metadata will be attached
 * @param {Object} params - metadata object
 * @param {string} token - user's token.
 * @returns {Object} serialized metadata object.
 */
export const createMetadata = (datasetId, params = {}, token, headers = {}) => {
  logger.info(`Create metadata for dataset ${datasetId}`);

  return WRIAPI.post(`dataset/${datasetId}/metadata`,
    params,
    {
      headers: {
        Authorization: token,
        ...headers
      }
    })
    .then(({ data }) => WRISerializer(data))
    .catch(({ response }) => {
      const { status, statusText } = response;

      logger.error(`Error creating metadata ${status}: ${statusText}`);
      throw new Error(`Error creating metadata ${status}: ${statusText}`);
    });
};

/**
 * Updates a metadata object in the specified dataset
 * This methods requires authentication.
 *
 * @param {*} datasetId - dataset ID where the metadata will be attached
 * @param {Object} params - metadata object
 * @param {string} token - user's token.
 * @returns {Object} serialized metadata object.
 */
export const updateMetadata = (datasetId, params = {}, token, headers = {}) => {
  logger.info(`Update metadata for dataset ${datasetId}`);

  return WRIAPI.patch(`dataset/${datasetId}/metadata`,
    params,
    {
      headers: {
        Authorization: token,
        ...headers
      }
    })
    .then(({ data }) => WRISerializer(data))
    .catch(({ response }) => {
      const { status, statusText } = response;

      logger.error(`Error updating metadata for dataset: ${datasetId}. ${status}: ${statusText}`);
      throw new Error(`Error updating metadata for dataset: ${datasetId}. ${status}: ${statusText}`);
    });
};

export default {
  fetchDatasets,
  fetchDataset,
  fetchDatasetTags,
  updateDatasetTags,
  deleteDataset,
  createDataset,
  updateDataset,
  createMetadata,
  updateMetadata
};

