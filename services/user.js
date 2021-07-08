// utils
import { logger } from 'utils/logs';
import {
  localAPI,
  WRIAPI,
} from 'utils/axios';

/**
 * Logs in a user based on the email + password combination
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#login-email-password|here}
 * @param {Object} options
 * @returns {Object}
 */
export const loginUser = ({ email, password }) => {
  logger.info('Login user');
  return localAPI
    .post('local-sign-in', { email, password })
    .then((response) => response.data);
};

/**
 * This function sends a request to reset the user's password.
 * It generates a token to be used in resetPassword
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#password-recovery|here}
 * @param {Object} options
 * @returns {Object}
 */
export const forgotPassword = ({ email }) => {
  logger.info('Forgot password');
  return WRIAPI
    .post('auth/reset-password', { email })
    .then((response) => response.data)
    .catch(({ response }) => {
      const { status, statusText } = response;

      if (status >= 300) {
        logger.error(`Error requesting token for password reset: ${status}: ${statusText}`);
        throw new Error(`Error requesting token for password reset: ${status}: ${statusText}`);
      }
    });
};

/**
 * Register a new user based on the email + password combination
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#registration|here}
 * @param {Object} options
 * @returns {Object}
 */
export const registerUser = ({ email }) => {
  logger.info('Register user');
  return WRIAPI
    .post('auth/sign-up',
      {
        email,
        apps: [process.env.NEXT_PUBLIC_APPLICATIONS],
      })
    .then((response) => response.data)
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error registering user: ${status}: ${statusText}`);
      throw new Error(`Error registering user: ${status}: ${statusText}`);
    });
};

/**
 * Resets the user's password.
 * Needs the token hosted in the email sent in forgotPassword
 * NOTE:this is NOT implemented in the API to be done from the app.
 * right now the only way it's through the email link pointing to Control Tower.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#password-recovery|here}
 * @param {Object} options
 * @returns {Object}
 */
export const resetPassword = ({ tokenEmail, password, repeatPassword }) => {
  logger.info('Reset password');
  return WRIAPI
    .post(`auth/reset-password/${tokenEmail}`,
      {
        password,
        repeatPassword,
      })
    .then((response) => response.data)
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error resetting user password: ${status}: ${statusText}`);
      throw new Error(`Error resetting user password: ${status}: ${statusText}`);
    });
};

/**
 * Upload user photo
 * @param {Blob} file file data
 * @param {Object} user
 */
export const uploadPhoto = (file, user) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = () => {
    const bodyObj = {
      data: {
        attributes: {
          user_id: user.id,
          avatar: reader.result,
        },
      },
    };

    return fetch(`${process.env.NEXT_PUBLIC_WRI_API_URL}/v1/profile`, {
      method: 'POST',
      body: JSON.stringify(bodyObj),
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token,
      },
    })
      .then((response) => response.json())
      .then(({ data }) => {
        resolve(data.attributes.avatar.original);
      });
  };

  reader.onerror = (error) => {
    reject(error);
  };
});

export const fetchUser = (userToken) => WRIAPI.get('/auth/user/me', {
  headers: {
    Authorization: userToken,
  },
})
  .then(({ status, statusText, data }) => {
    if (status >= 400) throw Error(statusText);
    return data;
  })
  .catch(() => {
    throw Error('unable to fetch user');
  });
