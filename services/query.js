import { WRIAPI } from 'utils/axios';

export const fetchQuery = (token, sql) =>
  WRIAPI.get('/query', {
    headers: { Authorization: token },
    params: { sql },
    transformResponse: [].concat(
      WRIAPI.defaults.transformResponse,
      _d => _d.data
    )
  })
    .then((response) => {
      if (response.status === 200) return response;
      throw response;
    })
    .catch((err) => { throw err; });

export default { fetchQuery };
