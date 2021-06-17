import {
  WRIAPI,
} from 'utils/axios';

export const signIn = (userCredentials = {}) => WRIAPI.post('/auth/login', userCredentials)
  .then((response) => {
    if (response.status >= 400) throw Error(response.status);
    return response;
  });

export const signOut = (userToken) => WRIAPI.get('/auth/logout', {
  headers: {
    Authorization: `Bearer ${userToken}`,
  },
})
  .then(({ status, statusText, data }) => {
    if (status >= 400) throw Error(statusText);
    return data;
  });

export const updateUser = (userData, userToken) => WRIAPI.patch('/auth/user/me',
  userData,
  {
    headers: {
      Authorization: userToken,
    },
  })
  .then(({ status, statusText, data }) => {
    if (status >= 400) throw Error(statusText);
    return data;
  });
