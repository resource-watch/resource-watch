import { WRIAPI } from 'utils/axios';

/**
 * Send GET request to /query
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#query|here}
 * @param {String} token token User's token
 * @param {*} sql mandatory parameter
 * @param {Object} params request paremeters to API.
 */
export const fetchQuery = (token, sql, params = {}) => {
  if (!token) {
    console.error('This is an authorized endpoint. A token need to be provided.');
    return null;
  }
  if (!sql) {
    console.error('A SQL query is mandatory to perform this fetching.');
    return null;
  }

  return WRIAPI.get('/v1/query', {
    headers: {
      ...WRIAPI.defaults.headers,
      Authorization: token,
    },
    params: {
      sql,
      ...params,
    },
  })
    .then((response) => {
      if (response.status === 200) return response;
      throw response;
    })
    .catch((err) => { throw err; });
};

export default { fetchQuery };
