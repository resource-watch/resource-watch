import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

/**
 * Get area
 */
export const fetchArea = (id, params = {}, headers = {}) => {
  logger.info(`Fetch area ${id}`);
  return WRIAPI.get(
    `area/${id}`,
    {
      headers: {
        ...headers,
        'Upgrade-Insecure-Requests': 1
      },
      params: { ...params }
    }
  )
    .then(response => WRISerializer(response.data));
};

/**
 * Get user areas
 */
export const fetchUserAreas = (token) => {
  logger.info('Fetch user areas');
  WRIAPI.get(`area?application=${process.env.APPLICATIONS}&env=${process.env.API_ENV}`, {
    headers: {
      Authorization: token,
      'Upgrade-Insecure-Requests': 1
    }
  }).then(response => WRISerializer(response.data));
};

/**
 * Deletes an area
 * @param {areaId} ID of the area that will be deleted
 * @param {token} User token
 * @returns {Promise}
 */
export const deleteArea = (areaId, token) => {
  logger.info(`Delete area ${areaId}`);
  return WRIAPI.delete(`area/${areaId}`, { headers: { Authorization: token } });
};

/**
 * Create new area
 */
export const createArea = (name, geostore, token) => {
  logger.info('Create area');
  const bodyObj = {
    name,
    application: process.env.APPLICATIONS,
    env: process.env.API_ENV,
    geostore
  };

  return WRIAPI.post('area', bodyObj, { headers: { Authorization: token } });
};

/**
 * Update area
 */
export const updateArea = (id, name, token, geostore) => {
  logger.info(`Update area ${id}`);
  const bodyObj = {
    name,
    application: process.env.APPLICATIONS,
    env: process.env.API_ENV,
    geostore
  };

  return WRIAPI.patch(`area/${id}`, bodyObj, { headers: { Authorization: token } });
};

export default {
  fetchArea,
  fetchUserAreas,
  deleteArea,
  createArea,
  updateArea
};
