import { WRIAPI } from 'utils/axios';

/**
 * Get Geostore
 */
export const getGeostore = id => WRIAPI.get(`geostore/${id}`);

export const createGeostore = async (geojson) => {
  const response = await WRIAPI.post('geostore',
    geojson,
    { headers: { 'Content-Type': 'application/json' } })
    .catch(() => { throw new Error("The file couldn't be processed correctly. Try again in a few minutes."); });
  return response.data.data;
};

export default {
  createGeostore,
  getGeostore
};
