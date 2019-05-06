import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

/**
 * Fetchs widgets according to params.
 *
 * @param {Object[]} params - params sent to the API.
 * @returns {Object[]} array of serialized widgets.
 */
export const fetchWidgets = (params = {}, _meta = false) => {
  logger.info('fetches widgets');
  return WRIAPI.get('/widget', {
    headers: {
      ...WRIAPI.defaults.headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1
    },
    params: {
      env: process.env.API_ENV,
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
 * @param {Object[]} params - params sent to the API.
 * @returns {Object} serialized specified widget.
 */
export const fetchWidget = (id, params = {}) => {
  if (!id) throw Error('widget id is mandatory to perform this fetching.');
  logger.info(`Fetches widget: ${id}`);

  return WRIAPI.get(`/widget/${id}`, {
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

export default { fetchWidget };
