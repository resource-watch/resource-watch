import { WRIAPI } from 'utils/axios';

export const fetchQuery = (token, sql, params = {}) => {
  if (!token) throw Error('This is an authorized endpoint. A token need to be provided.');
  if (!sql) throw Error('A SQL query is mandatory to perform this fetching.');

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
