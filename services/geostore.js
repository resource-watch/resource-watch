import axios from 'axios';
import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

/**
 * fetches Geostore
 * @param {Object[]} id - geostore ID.
 * @param {Object[]} params - params of the request
 * @returns {Object[]} serialized geostore object.
 */
export const fetchGeostore = (id, params = {}) => {
  logger.info(`Fetch geostore ${id}`);

  return WRIAPI.get(`geostore/${id}`, { ...params })
    .then((response) => {
      const { status, statusText, data } = response;

      if (status >= 300) {
        logger.error('Error fetching geostore:', `${status}: ${statusText}`);
        throw new Error(statusText);
      }

      return WRISerializer(data);
    })
    .catch((thrown) => {
      if (axios.isCancel(thrown)) {
        throw new Error(thrown.message);
      } else {
        const { status, statusText } = thrown;
        logger.error(`Error fetching geostore ${id}: ${status}: ${statusText}`);
        throw new Error(`Error fetching geostore ${id}: ${status}: ${statusText}`);
      }
    });
};

export const createGeostore = (geojson) => {
  logger.info('Create geostore');
  return WRIAPI.post('geostore', { geojson }, {
    transformResponse: [].concat(
      WRIAPI.defaults.transformResponse,
      (({ data }) => ({ geostore: data }))
    )
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
 */
export const fetchCountries = () => {
  logger.info('Fetch countries');
  return WRIAPI.get('geostore/admin/list')
    .then(array =>
      array.data.data.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        }
        // eslint-disable-line no-else-return
        return 0;
      }))
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error fetching countries: ${status}: ${statusText}`);
      throw new Error(`Error fetching countries: ${status}: ${statusText}`);
    });
};

/**
 * Get country
 */
export const fetchCountry = (iso) => {
  logger.info(`Fetch country: ${iso}`);
  return WRIAPI.get(`query/134caa0a-21f7-451d-a7fe-30db31a424aa?sql=SELECT name_engli as label, st_asgeojson(the_geom_simple) as geojson, bbox as bounds from gadm28_countries WHERE iso = '${iso}'`)
    .catch((response) => {
      const { status, statusText } = response;
      logger.error(`Error fetching country ${iso}: ${status}: ${statusText}`);
      throw new Error(`Error fetching country ${iso}: ${status}: ${statusText}`);
    });
};

export default {
  createGeostore,
  fetchGeostore,
  fetchCountries,
  fetchCountry
};
