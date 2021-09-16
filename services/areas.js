import WRISerializer from 'wri-json-api-serializer';

// utils
import {
  WRIAPI,
} from 'utils/axios';
import { logger } from 'utils/logs';

/**
 * Get area.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#get-area|here}
 * @param {String} id Area id.
 * @param {Object} params Request parameters.
 * @param {Object} headers Request headers.
 * @returns {Object}
 */
export const fetchArea = (id, params = {}, headers = {}) => {
  logger.info(`Fetch area ${id}`);

  return WRIAPI.get(
    `/v2/area/${id}`,
    {
      headers: {
        ...headers,
        'Upgrade-Insecure-Requests': 1,
      },
      params: {
        env: process.env.NEXT_PUBLIC_API_ENV,
        ...params,
      },
    },
  )
    .then((response) => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error fetching area ${id}: ${status}: ${statusText}`);
      throw new Error(`Error fetching area ${id}: ${status}: ${statusText}`);
    });
};

/**
 * Get user areas.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#get-user-areas|here}
 * @param {String} token user's token.
 * @returns {Object}
 */
export const fetchUserAreas = (token, params = {}, _meta = false) => {
  logger.info('Fetch user areas');

  return WRIAPI.get('/v2/area', {
    headers: {
      Authorization: token,
      'Upgrade-Insecure-Requests': 1,
    },
    params: {
      application: process.env.NEXT_PUBLIC_APPLICATIONS,
      env: process.env.NEXT_PUBLIC_API_ENV,
      ...params,
    },
    transformResponse: [].concat(
      WRIAPI.defaults.transformResponse,
      (({ data, meta }) => ({ areas: data, meta })),
    ),
  })
    .then((response) => {
      const { status, statusText, data } = response;
      const { areas, meta } = data;

      if (status >= 300) {
        logger.error('Error fetching areas:', `${status}: ${statusText}`);
        throw new Error(statusText);
      }

      if (_meta) {
        return {
          areas: WRISerializer({ data: areas }),
          meta,
        };
      }

      return WRISerializer({ data: areas });
    })
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error fetching user areas: ${status}: ${statusText}`);
      throw new Error(`Error fetching user areas: ${status}: ${statusText}`);
    });
};

/**
 * Delete area
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#delete-area|here}
 * @param {String} areaId - ID of the area that will be deleted
 * @param {String} token - User token
 * @returns {Promise}
 */
export const deleteArea = (areaId, token) => {
  logger.info(`Delete area ${areaId}`);

  return WRIAPI.delete(`/v2/area/${areaId}`, {
    headers: { Authorization: token },
  })
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error deleting area ${areaId}: ${status}: ${statusText}`);
      throw new Error(`Error deleting area ${areaId}: ${status}: ${statusText}`);
    });
};

/**
 * Create new area.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#create-area|here}
 * @param {String} name
 * @param {String} geostore Geostore ID
 * @param {String} token user's token
 * @returns {Object}
 */
export const createArea = (name, geostore, token) => {
  logger.info('Create area');

  const bodyObj = {
    name,
    application: process.env.NEXT_PUBLIC_APPLICATIONS,
    env: process.env.NEXT_PUBLIC_API_ENV,
    geostore,
  };

  return WRIAPI.post('/v2/area', bodyObj, { headers: { Authorization: token } })
    .then((response) => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error creating area: ${status}: ${statusText}`);
      throw new Error(`Error creating area: ${status}: ${statusText}`);
    });
};

/**
 * updates an area.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#updating-an-area|here}
 * @param {String} id area ID.
 * @param {Object} params request parameters.
 * @param {String} token user's token.
 * @returns {Object}
 */
export const updateArea = (id, params, token) => {
  logger.info(`Update area ${id}`);

  return WRIAPI.patch(`/v2/area/${id}`, {
    application: process.env.NEXT_PUBLIC_APPLICATIONS,
    env: process.env.NEXT_PUBLIC_API_ENV,
    ...params,
  },
  {
    headers: {
      Authorization: token,
    },
  })
    .then((response) => WRISerializer(response.data))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error updating area ${id}: ${status}: ${statusText}`);
      throw new Error(`Error updating area ${id}: ${status}: ${statusText}`);
    });
};
