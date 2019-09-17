import { WRIAPI } from 'utils/axios';

/**
 * Get area
 */
export const getArea = (id, token) =>
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

export default { getArea };
