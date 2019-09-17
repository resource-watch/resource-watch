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

/**
 * Fetch countries
 */
export const fetchCountries = () =>
  WRIAPI.get('geostore/admin/list')
    .then(array =>
      array.data.data.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        }
        // eslint-disable-line no-else-return
        return 0;
      }));

/**
 * Get country
 */
export const getCountry = iso =>
  WRIAPI.get(`query/134caa0a-21f7-451d-a7fe-30db31a424aa?sql=SELECT name_engli as label, st_asgeojson(the_geom_simple) as geojson, bbox as bounds from gadm28_countries WHERE iso = '${iso}'`);


export default {
  createGeostore,
  getGeostore,
  fetchCountries,
  getCountry
};
