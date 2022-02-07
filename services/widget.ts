import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

// types
import type { APIWidgetSpec, WidgetMetadata } from 'types/widget';
import type { UserWithToken } from 'types/user';
import { AxiosResponse } from 'axios';

/**
 * Fetch widgets according to params.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#how-to-obtain-all-widgets|here}
 * @param {Object} params - params sent to the API.
 * @param {Object} headers - headers used in the request
 * @param {boolean} _meta - flag indicating whether meta information should be
 * included in the response or not
 */
export const fetchWidgets = (
  params: Record<string, string | number> = {},
  headers: Record<string, string | number> = {},
  _meta = false,
) => {
  logger.info('fetches widgets');
  return WRIAPI.get('/v1/widget', {
    headers: {
      ...WRIAPI.defaults.headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1,
      ...headers,
    },
    params: {
      env: process.env.NEXT_PUBLIC_API_ENV,
      application: process.env.NEXT_PUBLIC_APPLICATIONS,
      ...params,
    },
    transformResponse: [].concat(WRIAPI.defaults.transformResponse, ({ data, meta }) => ({
      widgets: data,
      meta,
    })),
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
          meta,
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
 * Fetches data for a specific widget.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#how-obtain-a-single-widget|here}
 * @param {String} id - widget id.
 * @param {Object} params - params sent to the API.
 */
export const fetchWidget = (
  id: string,
  params: Record<string, string | number> = {},
): Promise<APIWidgetSpec> => {
  if (!id) throw Error('The widget id is mandatory to perform this request (fetchWidget).');
  logger.info(`Fetch widget: ${id}`);

  return WRIAPI.get<APIWidgetSpec>(`/v1/widget/${id}`, {
    headers: {
      ...WRIAPI.defaults.headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1,
    },
    params: {
      env: process.env.NEXT_PUBLIC_API_ENV,
      application: process.env.NEXT_PUBLIC_APPLICATIONS,
      ...params,
    },
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
 * Deletes a specified widget.
 * This fetch needs authentication.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#delete-a-widget|here}
 * @param {String} widgetId - widget ID to be deleted.
 * @param {String} datasetId - dataset ID.
 * @param {String} token - user's token.
 */
export const deleteWidget = (
  widgetId: string,
  datasetId: string,
  token: Pick<UserWithToken, 'token'>,
): Promise<AxiosResponse> => {
  logger.info(`Delete widget: ${widgetId}`);

  return WRIAPI.delete<APIWidgetSpec>(`/v1/dataset/${datasetId}/widget/${widgetId}`, {
    headers: {
      ...WRIAPI.defaults.headers,
      Authorization: token,
    },
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
 * Updates data for the widget provided.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#update-a-widget|here}
 * @param {Object} widget - widget data.
 * @param {string} token - user's token.
 */
export const updateWidget = (
  widget: APIWidgetSpec,
  token: Pick<UserWithToken, 'token'>,
): Promise<APIWidgetSpec> => {
  logger.info(`Update widget: ${widget.id}`);
  return WRIAPI.patch<APIWidgetSpec>(`/v1/widget/${widget.id}`, widget, {
    headers: { Authorization: token },
  })
    .then((response) => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error updating widget ${widget.id}: ${status}: ${statusText}`);
      throw new Error(`Error updating widget ${widget.id}: ${status}: ${statusText}`);
    });
};

/**
 * Creates a new widget.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#create-a-widget|here}
 * @param {Object} widget - widget data.
 * @param {string} datasetId - Dataset ID the widget belongs to.
 * @param {string} token - user's token.
 */
export const createWidget = (
  widget: Partial<APIWidgetSpec>,
  datasetId: string,
  token: Pick<UserWithToken, 'token'>,
): Promise<APIWidgetSpec> => {
  logger.info('Create widget');
  return WRIAPI.post<APIWidgetSpec>(
    `/v1/dataset/${datasetId}/widget`,
    {
      application: process.env.NEXT_PUBLIC_APPLICATIONS.split(','),
      env: process.env.NEXT_PUBLIC_API_ENV,
      ...widget,
    },
    { headers: { Authorization: token } },
  )
    .then((response) => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error creating widget ${status}: ${statusText}`);
      throw new Error(`Error creating widget ${status}: ${statusText}`);
    });
};

/**
 * Fetches the metadata associated to the widget provided.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#getting-metadata|here}
 * @param {string} widgetId - widget data.
 * @param {string} datasetId - Dataset ID the widget belongs to.
 * @param {string} token - user's token.
 * @param {Object} params - request parameters.
 */
export const fetchWidgetMetadata = (
  widgetId: string,
  datasetId: string,
  token: Pick<UserWithToken, 'token'>,
  params: Record<string, string | number>,
): Promise<Pick<APIWidgetSpec, 'metadata'>> => {
  logger.info(`Update widget metadata: ${widgetId}`);
  return WRIAPI.get(`/v1/dataset/${datasetId}/widget/${widgetId}/metadata`, {
    headers: { Authorization: token },
    params: {
      application: process.env.NEXT_PUBLIC_APPLICATIONS,
      env: process.env.NEXT_PUBLIC_API_ENV,
      ...params,
    },
  })
    .then((response) => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error fetching widget metadata ${widgetId}: ${status}: ${statusText}`);
      throw new Error(`Error fetching widget metadata ${widgetId}: ${status}: ${statusText}`);
    });
};

/**
 * Updates the metadata for the widget provided.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#updating-a-metadata|here}
 * @param {Object} widget - widget data.
 * @param {string} datasetId - Dataset ID the widget belongs to.
 * @param {Object} metadata - metadata to be updated.
 * @param {string} token - user's token.
 */
export const updateWidgetMetadata = (
  widgetId: string,
  datasetId: string,
  metadata: Pick<APIWidgetSpec, 'metadata'>,
  token: Pick<UserWithToken, 'token'>,
): Promise<Pick<APIWidgetSpec, 'metadata'>> => {
  logger.info(`Update widget metadata: ${widgetId}`);
  return WRIAPI.patch<Pick<APIWidgetSpec, 'metadata'>>(
    `/v1/dataset/${datasetId}/widget/${widgetId}/metadata`,
    metadata,
    {
      headers: { Authorization: token },
    },
  )
    .then((response) => WRISerializer(response.data))
    .catch((error) => {
      let errorMessage = error.message;

      if (error.response) {
        const { status, statusText } = error.response;
        errorMessage = `${status} – ${statusText}`;
      }

      logger.error(`Error updating widget metadata ${widgetId}: ${errorMessage}`);
      throw new Error(`Error updating widget metadata ${widgetId}: ${errorMessage}`);
    });
};

/**
 * Creates the metadata for the widget provided.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#creating-a-metadata-object|here}
 * @param {string} widgetId - widget id.
 * @param {string} datasetId - Dataset ID the widget belongs to.
 * @param {Object} metadata - metadata to be updated.
 * @param {string} token - user's token.
 */
export const createWidgetMetadata = (
  widgetId: string,
  datasetId: string,
  metadata: WidgetMetadata,
  token: Pick<UserWithToken, 'token'>,
): Promise<Pick<APIWidgetSpec, 'metadata'>> => {
  logger.info(`Update widget metadata: ${widgetId}`);
  return WRIAPI.post<Pick<APIWidgetSpec, 'metadata'>>(
    `/v1/dataset/${datasetId}/widget/${widgetId}/metadata`,
    {
      application: process.env.NEXT_PUBLIC_APPLICATIONS,
      env: process.env.NEXT_PUBLIC_API_ENV,
      ...metadata,
    },
    { headers: { Authorization: token } },
  )
    .then((response) => WRISerializer(response.data))
    .catch((error) => {
      let errorMessage = error.message;

      if (error.response) {
        const { status, statusText } = error.response;
        errorMessage = `${status} – ${statusText}`;
      }

      logger.error(`Error creating widget metadata ${widgetId}:  ${errorMessage}`);
      throw new Error(`Error creating widget metadata ${widgetId}:  ${errorMessage}`);
    });
};
