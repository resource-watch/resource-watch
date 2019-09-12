import * as queryString from 'query-string';
import { WRIAPI } from 'utils/axios';

/**
 * Retrieve all favourites items of the user
 * @param {*} token User's token
 */
export const getFavourites = (token) => {
  const queryParams = queryString.stringify({
    application: process.env.APPLICATIONS,
    env: process.env.API_ENV
  });

  return WRIAPI.get(`favourite?${queryParams}`,
    {
      headers: {
        Authorization: token,
        'Upgrade-Insecure-Requests': 1
      }
    })
    .then(response => response.data);
};

/**
 * Creates a new favourite item attached to the current user
 * @param {*} token User's token
 * @param {*} resourceId Id of the resource
 * @param {*} resourceType Resource's type (can be dataset, layer or widget)
 */
export const createFavourite = (token, { resourceId, resourceType }) =>
  WRIAPI.post('favourite',
    {
      application: process.env.APPLICATIONS,
      resourceId,
      resourceType
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    });

/**
 * Deletes an existing favourite item attached to the current user
 * @param {*} token User's token
 * @param {*} resourceId Id of the resource
 */
export const deleteFavourite = (token, resourceId) =>
  WRIAPI.delete(`/favourite/${resourceId}`,
    { headers: { Authorization: token } });

export default {
  getFavourites,
  deleteFavourite,
  createFavourite
};
