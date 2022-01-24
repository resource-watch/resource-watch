import WRISerializer from 'wri-json-api-serializer';

// utils
import { logger } from 'utils/logs';
import { localAPI, WRIAPI } from 'utils/axios';

import type { User, UserData, UserWithToken } from 'types/user';

/**
 * Logs in a user based on the email + password combination
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#login-email-password|here}
 * @param {Object} options
 * @returns {Object}
 */
export const loginUser = ({ email, password }) => {
  logger.info('Login user');
  return localAPI.post('local-sign-in', { email, password }).then((response) => response.data);
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
  return WRIAPI.post('auth/reset-password', { email })
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
  return WRIAPI.post('auth/sign-up', {
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
  return WRIAPI.post(`auth/reset-password/${tokenEmail}`, {
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
export const uploadPhoto = (file, user) =>
  new Promise((resolve, reject) => {
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

export const fetchUser = (userToken): Promise<User> =>
  WRIAPI.get('/auth/user/me', {
    headers: {
      Authorization: userToken,
    },
  })
    .then((res) => res.data)
    .catch(() => {
      throw Error('unable to fetch user');
    });

export const fetchUserData = (userToken: string): Promise<UserData> => {
  return WRIAPI.get('/v2/user', {
    headers: {
      Authorization: userToken,
    },
  })
    .then((res) => WRISerializer(res.data))
    .catch((error) => {
      let errorMessage = error.message;

      if (error.response) {
        const { status, statusText } = error.response;
        errorMessage = `${status} – ${statusText}`;

        if (status === 404) {
          logger.error('User not found');
          throw new Error('User not found');
        }
      }

      throw new Error(`Error getting user data:  ${errorMessage}`);
    });
};

export const updateUserData = (
  user: UserWithToken,
  userData: Partial<UserData>,
): Promise<UserData> => {
  return WRIAPI.patch(`/v2/user/${user.id}`, userData, {
    headers: {
      Authorization: user.token,
    },
  })
    .then((res) => res.data)
    .catch((error) => {
      let errorMessage = error.message;

      if (error.response) {
        const { status, statusText } = error.response;
        errorMessage = `${status} – ${statusText}`;
      }

      logger.error(`Error updating user data:  ${errorMessage}`);
      throw new Error(`Error updating user data:  ${errorMessage}`);
    });
};

export const createUserData = (userToken, user: Partial<User>): Promise<UserData> => {
  return WRIAPI.post('/v2/user', user, {
    headers: {
      Authorization: userToken,
    },
  })
    .then((res) => WRISerializer(res.data))
    .catch((error) => {
      let errorMessage = error.message;

      if (error.response) {
        const { status, statusText } = error.response;
        errorMessage = `${status} – ${statusText}`;
      }

      logger.error(`Error creation user data:  ${errorMessage}`);
      throw new Error(`Error creation user data:  ${errorMessage}`);
    });
};
