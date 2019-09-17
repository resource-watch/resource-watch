import { WRIAPI } from 'utils/axios';

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

export default {
  getArea,
  getCountry,
  fetchCountries
};
