import { WRIAPI } from 'utils/axios';

/**
 * Get area
 */
export const fetchArea = (id, token) =>
  WRIAPI.get(
    `area/${id}?application=${process.env.APPLICATIONS}&env=${process.env.API_ENV}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        'Upgrade-Insecure-Requests': 1
      }
    }
  );


/**
 * Get user areas
 */
export const getUserAreas = token =>
  WRIAPI.get(`area?application=${process.env.APPLICATIONS}&env=${process.env.API_ENV}`, {
    headers: {
      Authorization: token,
      'Upgrade-Insecure-Requests': 1
    }
  }).then(response => response.data.data);

/**
 * Deletes an area
 * @param {areaId} ID of the area that will be deleted
 * @param {token} User token
 * @returns {Promise}
 */
export const deleteArea = (areaId, token) =>
  WRIAPI.delete(`area/${areaId}`, { headers: { Authorization: token } });

/**
 * Create new area
 */
export const createArea = (name, geostore, token) => {
  const bodyObj = {
    name,
    application: process.env.APPLICATIONS,
    env: process.env.API_ENV,
    geostore
  };

  return WRIAPI.post('area', bodyObj, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    }
  });
};

/**
 * Update area
 */
export const updateArea = (id, name, token, geostore) => {
  const bodyObj = {
    name,
    application: process.env.APPLICATIONS,
    env: process.env.API_ENV,
    geostore
  };

  return WRIAPI.patch(`area/${id}`, bodyObj, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    }
  });
};

export default {
  fetchArea,
  getUserAreas,
  deleteArea,
  createArea,
  updateArea
};
