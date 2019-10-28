import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

/**
 * Get all tags
 */
export const fetchAllTags = (params = {}) => {
  logger.info('Fetch all tags');
  return WRIAPI.get('graph/query/list-concepts',
    {
      headers: { 'Upgrade-Insecure-Requests': 1 },
      params: {
        env: process.env.API_ENV,
        application: process.env.APPLICATIONS,
        ...params
      }
    })
    .then(response => response.data.data)
    .catch((response) => {
      const { status, statusText } = response;
      logger.error(`Error fetching all tags: ${status}: ${statusText}`);
      throw new Error(`Error fetching all tags: ${status}: ${statusText}`);
    });
};

/**
 * Get inferred tags
 */
export const fetchInferredTags = (tags, params = {}) => {
  logger.info('Fetch inferred tags');
  return WRIAPI.get('graph/query/concepts-inferred',
    {
      headers: { 'Upgrade-Insecure-Requests': 1 },
      params: {
        env: process.env.API_ENV,
        application: process.env.APPLICATIONS,
        concepts: tags,
        ...params
      }
    })
    .then(response => response.data.data)
    .catch((response) => {
      const { status, statusText } = response;
      logger.error(`Error fetching inferred tags: ${tags} ${status}: ${statusText}`);
      throw new Error(`Error inferred tags: ${tags} ${status}: ${statusText}`);
    });
};

/**
 * Send a request to count a view to the dataset
 * @param {string} datasetId Dataset ID
 * @param {string} [token] User token
 * @returns {Promise<void>}
 */
export const countDatasetView = (datasetId, token, params = {}) => {
  logger.info('Count dataset view');
  return WRIAPI.post(`graph/dataset/${datasetId}/visited`,
    {},
    {
      headers: { Authorization: token },
      params: {
        env: process.env.API_ENV,
        application: process.env.APPLICATIONS,
        ...params
      }
    })
    .catch((response) => {
      const { status, statusText } = response;
      logger.error(`Error in count dataset view ${datasetId}: ${status}: ${statusText}`);
      throw new Error(`Error in count dataset view ${datasetId}: ${status}: ${statusText}`);
    });
};

/**
 * Get the list of most viewed datasets
 * @returns {Promise<string[]>} List of sorted ids
 */
export const fetchMostViewedDatasets = (params = {}) => {
  logger.info('Fetch most viewed datasets');
  return WRIAPI.get('graph/query/most-viewed',
    {
      params: {
        env: process.env.API_ENV,
        application: process.env.APPLICATIONS,
        ...params
      },
      headers: { 'Upgrade-Insecure-Requests': 1 }
    })
    .then(response => WRISerializer(response.data))
    .catch((response) => {
      const { status, statusText } = response;
      logger.error(`Error fetching most viewed datasets: ${status}: ${statusText}`);
      throw new Error(`Error fetching most viewed datasets: ${status}: ${statusText}`);
    });
};

/**
 * Get the list of most favourited datasets
 * @returns {Promise<string[]>} List of sorted ids
 */
export const fetchMostFavoritedDatasets = (params = {}) => {
  logger.info('Fetch most favorited datasets');
  return WRIAPI.get('graph/query/most-liked-datasets',
    {
      params: {
        env: process.env.API_ENV,
        application: process.env.APPLICATIONS,
        ...params
      },
      headers: { 'Upgrade-Insecure-Requests': 1 }
    })
    .then(response => WRISerializer(response.data))
    .catch((response) => {
      const { status, statusText } = response;
      logger.error(`Error fetching most favorited datasets: ${status}: ${statusText}`);
      throw new Error(`Error fetching most favorited datasets: ${status}: ${statusText}`);
    });
};

export const fetchSimilarDatasets = (datasetIds, params = {}, withAncestors = true) => {
  logger.info('Fetch similar datasets');
  const endpoint = withAncestors ? 'similar-dataset-including-descendent' : 'similar-dataset';
  return WRIAPI.get(
    `graph/query/${endpoint}`,
    {
      params: {
        dataset: datasetIds,
        env: process.env.API_ENV,
        application: process.env.APPLICATIONS,
        ...params
      },
      headers: { 'Upgrade-Insecure-Requests': 1 }
    }
  )
    .then(response => response.data.data)
    .catch((response) => {
      const { status, statusText } = response;
      logger.error(`Error fetching similart datasets: ${datasetIds} ${status}: ${statusText}`);
      throw new Error(`Error fetching similart datasets: ${datasetIds} ${status}: ${statusText}`);
    });
};

export default {
  fetchMostViewedDatasets,
  fetchMostFavoritedDatasets,
  fetchSimilarDatasets,
  countDatasetView,
  fetchInferredTags,
  fetchAllTags
};
