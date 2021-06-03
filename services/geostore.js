import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

/**
 * Fetches Geostore
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#obtain-a-geostore|here}
 * @param {String} id - geostore ID.
 * @returns {Object} serialized geostore object.
 */
export const fetchGeostore = (id, params = {}) => {
  logger.info(`Fetch geostore ${id}`);

  return WRIAPI.get(`/v1/geostore/${id}`, { ...params })
    .then((response) => {
      const { status, statusText, data } = response;

      if (status >= 300) {
        logger.error('Error fetching geostore:', `${status}: ${statusText}`);
        throw new Error(statusText);
      }

      return WRISerializer(data);
    });
};

/**
 * Create a Geostore
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#create-geostore|here}
 * @param {Object} geojson Geojson with your geometry
 */
export const createGeostore = (geojson) => {
  logger.info('Create geostore');
  return WRIAPI.post('/v1/geostore', { geojson }, {
    transformResponse: [].concat(
      WRIAPI.defaults.transformResponse,
      (({ data }) => ({ geostore: data })),
    ),
  })
    .then((response) => {
      const { status, statusText, data } = response;
      const { geostore } = data;
      if (status >= 300) {
        logger.error(`Error creating geostore: ${status}: ${statusText}`);
        throw new Error(`Error creating geostore: ${status}: ${statusText}`);
      }

      return geostore;
    })
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error creating geostore: ${status}: ${statusText}`);
      throw new Error(`Error creating geostore: ${status}: ${statusText}`);
    });
};

/**
 * Fetch countries
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#geostore|here}
 * @returns {Object[]}
 */
export const fetchCountries = () => {
  logger.info('Fetch countries');
  return WRIAPI.get('/v1/geostore/admin/list')
    .then((array) => array.data.data.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } if (a.name > b.name) {
        return 1;
      }
      // eslint-disable-line no-else-return
      return 0;
    }))
    .catch((error) => {
      logger.error(`Error fetching countries: ${error}`);
      throw new Error(`Error fetching countries: ${error}`);
    });
};

/**
 * Fetch country
 * @param {String} iso
 */
export const fetchCountry = (iso) => {
  logger.info(`Fetch country: ${iso}`);
  return WRIAPI.get(`/v1/query/134caa0a-21f7-451d-a7fe-30db31a424aa?sql=SELECT name_engli as label, st_asgeojson(the_geom_simple) as geojson, bbox as bounds from gadm28_countries WHERE iso = '${iso}'`)
    .catch((response) => {
      const { status, statusText } = response;
      logger.error(`Error fetching country ${iso}: ${status}: ${statusText}`);
      throw new Error(`Error fetching country ${iso}: ${status}: ${statusText}`);
    });
};

/**
 * Fetch countries
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/reference.html#get-geostore-by-country-code|here}
 * @returns {Object[]}
 */
export const fetchCountryV2 = (iso) => {
  logger.info(`Fetch country ${iso} v2`);
  return WRIAPI.get(`/v2/geostore/admin/${iso}`)
    .then(({ data }) => WRISerializer(data));
};
