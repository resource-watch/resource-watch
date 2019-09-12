import { logger } from 'utils/logs';
import { localAPI, controlTowerAPI, WRIAPI } from 'utils/axios';

/**
 * Logs in a user based on the email + password combination
 */
export const loginUser = ({ email, password }) =>
  localAPI
    .post('local-sign-in', { email, password }, { headers: { 'Content-Type': 'application/json' } })
    .then(response => response.data);

/**
 * This function sends a request to reset the user's password.
 * It generates a token to be used in resetPassword
 */
export const forgotPassword = ({ email }) =>
  controlTowerAPI
    .post('auth/reset-password', { email }, { params: { origin: process.env.APPLICATIONS } })
    .then(response => response.data)
    .catch(({ response }) => {
      const { status, statusText } = response;

      if (status >= 300) {
        logger.error('Error requesting token for password reset:', `${status}: ${statusText}`);
        console.error(statusText);
        throw new Error(statusText);
      }
    });

/**
 * Register a new user based on the email + password combination
 */
export const registerUser = ({ email, password, repeatPassword }) =>
  controlTowerAPI
    .post(
      'auth/sign-up',
      {
        email,
        password,
        repeatPassword,
        apps: [process.env.APPLICATIONS]
      },
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then((response) => {
      if (response.ok) return response.json();
      throw response;
    });

/**
 * Resets the user's password.
 * Needs the token hosted in the email sent in forgotPassword
 * NOTE:this is NOT implemented in the API to be done from the app.
 * right now the only way it's through the email link pointing to Control Tower.
 */
export const resetPassword = ({ tokenEmail, password, repeatPassword }) =>
  controlTowerAPI
    .post(
      `auth/reset-password/${tokenEmail}?origin=${process.env.APPLICATIONS}`,
      { password, repeatPassword },
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then((response) => {
      if (response.ok) return response.json();
      throw response;
    });

/**
 * Get user areas
 */
export const getUserAreas = token =>
  WRIAPI
    .get(`area?application=${process.env.APPLICATIONS}&env=${process.env.API_ENV}`, {
      headers: {
        Authorization: token,
        'Upgrade-Insecure-Requests': 1
      }
    })
    .then(response => response.data.data);

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

  return WRIAPI.post('area',
    bodyObj,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    });
};

export default {
  loginUser,
  forgotPassword,
  registerUser,
  resetPassword,
  getUserAreas,
  deleteArea,
  createArea
};
