import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

/**
 * Fetch tools
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#fetch-tools|here}
 * @param {Object} params Request paremeters.
 * @param {Object} headers Request headers.
 */
export const fetchTools = (token, params = {}, headers = {}) => {
  logger.info('Fetch tools');
  return WRIAPI.get(
    'tool',
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
      logger.error(`Error fetching tools: ${status}: ${statusText}`);
      throw new Error(`Error fetching tools: ${status}: ${statusText}`);
    });
};


/**
 * Fetch tool
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#fetch-tool|here}
 * @param {String} id Tool id.
 * @param {String} token Authentication token.
 * @param {Object} params Request paremeters.
 * @param {Object} headers Request headers.
 */
export const fetchTool = (id, token, params = {}, headers = {}) => {
  logger.info(`Fetch tool ${id}`);
  return WRIAPI.get(
    `tool/${id}`,
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
      logger.error(`Error fetching tool ${id}: ${status}: ${statusText}`);
      throw new Error(`Error fetching tool ${id}: ${status}: ${statusText}`);
    });
};

/**
 * Update tool
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#update-tool|here}
 * @param {Object} tool Tool to be updated.
 * @param {Object} token Authentication token.
 */
export const updateTool = (tool, token) => {
  logger.info(`Update tool ${tool.id}`);
  return WRIAPI.patch(`tool/${tool.id}`,
    { data: { attributes: { ...tool } } }
    , { headers: { Authorization: token } })
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error updating tool ${tool.id}: ${status}: ${statusText}`);
      throw new Error(`Error updating tool ${tool.id}: ${status}: ${statusText}`);
    });
};

/**
 * Create a new tool.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#create-a-tool|here}
 * @param {Object} tool Tool to be updated.
 * @param {Object} token Authentication token.
 */
export const createTool = (tool, token) => {
  logger.info('Create tool');
  return WRIAPI.post('tool',
    {
      data: {
        application: process.env.APPLICATIONS,
        env: process.env.API_ENV,
        attributes: { ...tool }
      }
    },
    { headers: { Authorization: token } })
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error creating tool ${status}: ${statusText}`);
      throw new Error(`Error creating tool ${status}: ${statusText}`);
    });
};

/**
 * Delete tool
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#fetch-tool|here}
 * @param {String} id Tool id.
 * @param {String} token Authentication token.
 * @param {Object} params Request paremeters.
 * @param {Object} headers Request headers.
 */
export const deleteTool = (id, token, params = {}, headers = {}) => {
  logger.info(`Delete tool ${id}`);
  return WRIAPI.delete(
    `tool/${id}`,
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
      logger.error(`Error deleting tool ${id}: ${status}: ${statusText}`);
      throw new Error(`Error deleting tool ${id}: ${status}: ${statusText}`);
    });
};


export default {
  fetchTools,
  fetchTool,
  createTool,
  updateTool,
  deleteTool
};

