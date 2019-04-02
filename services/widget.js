import { WRIAPI } from 'utils/axios';
import WRISerializer from 'wri-json-api-serializer';

export const fetchWidget = (id, params = {}) => {
  if (!id) throw Error('widget id is mandatory to perform this fetching.');
  return WRIAPI.get(`/widget/${id}`, {
    headers: {
      ...WRIAPI.defaults.headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1
    },
    params: {
      application: process.env.APPLICATIONS,
      ...params
    },
    transformResponse: [].concat(
      WRIAPI.defaults.transformResponse,
      ({ data }) => data
    )
  })
    .then(data => WRISerializer(data))
    .catch(({ errors }) => errors);
};

export default { fetchWidget };
