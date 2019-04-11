import { WRIAPI } from 'utils/axios';
import WRISerializer from 'wri-json-api-serializer';

// API docs: https://resource-watch.github.io/doc-api/index-rw.html#dataset

/**
 * Fetchs datasets according to params.
 *
 * @param {Object[]} params - params sent to the API.
 * @returns {Object[]} array of serialized datasets.
 */

export const fetchDatasets = (params = {}) =>
  WRIAPI.get('/dataset', {
    headers: {
      ...WRIAPI.defaults.headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1
    },
    params: {
      env: process.env.API_ENV,
      ...params
    }
  })
    .then((response) => {
      const { status, statusText, data } = response;
      if (status >= 400) throw new Error(statusText);
      return WRISerializer(data);
    });

export default { fetchDatasets };
