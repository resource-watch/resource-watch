import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

/**
 * Fetches widgets according to params.
 *
 * @param {Object} params - params sent to the API.
 * @param {Object} headers - headers used in the request
 * @param {boolean} _meta - flag indicating whether meta information should be
 * included in the response or not
 * @returns {Object[]} array of serialized widgets.
 */
export const fetchWidgets = (params = {}, headers = {}, _meta = false) => {
  logger.info('fetches widgets');
  return WRIAPI.get('widget', {
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
      (({ data, meta }) => ({ widgets: data, meta }))
    )
  })
    .then((response) => {
      const { status, statusText, data } = response;
      const { widgets, meta } = data;
      if (status >= 300) {
        logger.error('Error fetching widgets:', `${status}: ${statusText}`);
        throw new Error(statusText);
      }

      if (_meta) {
        return {
          widgets: WRISerializer({ data: widgets }),
          meta
        };
      }

      return WRISerializer({ data: widgets });
    })
    .catch((response) => {
      const { status, statusText } = response;

      logger.error(`Error fetching widgets: ${status}: ${statusText}`);
      throw new Error(`Error fetching widgets: ${status}: ${statusText}`);
    });
};


/**
 * fetches data for a specific widget.
 *
 * @param {String} id - widget id.
 * @param {Object} params - params sent to the API.
 * @returns {Object} serialized specified widget.
 */
export const fetchWidget = (id, params = {}) => {
  if (!id) throw Error('The widget id is mandatory to perform this request (fetchWidget).');
  logger.info(`Fetch widget: ${id}`);

  return WRIAPI.get(`widget/${id}`, {
    headers: {
      ...WRIAPI.defaults.headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1
    },
    params: {
      ...params,
      env: process.env.API_ENV,
      application: process.env.APPLICATIONS
    }
  })
    .then((response) => {
      const { status, statusText, data } = response;

      if (status >= 300) {
        if (status === 404) {
          logger.debug(`Widget '${id}' not found, ${status}: ${statusText}`);
        } else {
          logger.error(`Error fetching widget: ${id}: ${status}: ${statusText}`);
        }
        throw new Error(statusText);
      }
      return WRISerializer(data);
    })
    .catch(({ response }) => {
      const { status, statusText } = response;

      logger.error(`Error fetching widget ${id}: ${status}: ${statusText}`);
      throw new Error(`Error fetching widget ${id}: ${status}: ${statusText}`);
    });
};

/**
 * Deletes the specified widget.
 * This method requires authentication.
 *
 * @param {*} widgetId - widget ID to be deleted.
 * @param {string} datasetId - dataset ID the widget belongs to
 * @param {string} token - user's token.
 * @returns {Object} response.
 */
export const deleteWidget = (widgetId, datasetId, token) => {
  logger.info(`Delete widget: ${widgetId}`);

  return WRIAPI.delete(`dataset/${datasetId}/widget/${widgetId}`, {
    headers: {
      ...WRIAPI.defaults.headers,
      Authorization: token
    }
  })
    .then((response) => {
      const { status, statusText } = response;

      if (status >= 300) {
        if (status === 404) {
          logger.debug(`Widget '${widgetId}' not found, ${status}: ${statusText}`);
        } else {
          logger.error(`Error deleting widget: ${widgetId}: ${status}: ${statusText}`);
        }
        throw new Error(statusText);
      }
      return response;
    })
    .catch(({ response }) => {
      const { status, statusText } = response;

      logger.error(`Error deleting widget ${widgetId}: ${status}: ${statusText}`);
      throw new Error(`Error deleting widget ${widgetId}: ${status}: ${statusText}`);
    });
};

/**
 * fetches data for a specific widget.
 *
 * @param {Object} widget - widget data.
 * @param {string} datasetId - params sent to the API.
 * @param {string} token - user's token.
 * @returns {Object} serialized specified widget.
 */
export const updateWidget = (widget, datasetId, token) => {
  logger.info(`Update widget: ${widget.id}`);
  return WRIAPI.patch(`widget/${widget.id}`, widget, { headers: { Authorization: token } })
    .then(response => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error updating widget ${widget.id}: ${status}: ${statusText}`);
      throw new Error(`Error updating widget ${widget.id}: ${status}: ${statusText}`);
    });
}

export default {
  fetchWidgets,
  fetchWidget,
  updateWidget,
  deleteWidget
};
