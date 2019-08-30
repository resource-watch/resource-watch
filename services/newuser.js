import { localAPI } from 'utils/axios';

/**
 * Logs in a user based on email + password combination
 */
export const loginUser = ({ email, password }) => (
  localAPI.post('local-sign-in',
    { email, password },
    { headers: { 'Content-Type': 'application/json' } })
    .then(response => response.data)
);

export default {
  loginUser
};
