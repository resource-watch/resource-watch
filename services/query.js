import { WRIAPI } from 'utils/axios';

export const fetchQuery = (token, sql, params = {}) => {
  if (!token) {
    console.error('This is an authorized endpoint. A token need to be provided.');
    return null;
  }
  if (!sql) {
    console.error('A SQL query is mandatory to perform this fetching.');
    return null;
  }

  return WRIAPI.get('/query', {
    headers: {
      ...WRIAPI.defaults.headers,
      Authorization: token
    },
    params: {
      sql,
      ...params
    }
  })
    .then((response) => {
      if (response.status === 200) return response;
      throw response;
    })
    .catch((err) => { throw err; });
};

export default { fetchQuery };
