import { WRIAPI } from 'utils/axios';
import WRISerializer from 'wri-json-api-serializer';

// API docs: TBD

/**
 * Fetchs content of a specific page.
 *
 * @param {String} id - id of the page to fetch.
 * @returns {Object[]} page content serialized.
 */

export const fetchStaticPage = (id) => WRIAPI.get(`/v1/static_page/${id}`)
  .then((response) => {
    const { status, statusText, data } = response;
    if (status >= 400) throw new Error(statusText);
    return WRISerializer(data);
  });

export default { fetchStaticPage };
