import 'isomorphic-fetch';

export default class AreasService {
  constructor(options) {
    if (!options) throw new Error('options params is required.');
    if (!options.apiURL || options.apiURL === '') throw new Error('options.apiURL param is required.');
    this.opts = options;
  }

  /**
   * Fetch countries
   */
  fetchCountries() {
    return fetch(`${this.opts.apiURL}/query/134caa0a-21f7-451d-a7fe-30db31a424aa?sql=SELECT iso as value, name_engli as label from gadm28_countries order by name_engli asc`)
      .then(response => response.json());
  }

  /**
   * Get country
   */
  getCountry(iso) {
    return fetch(`${this.opts.apiURL}/query/134caa0a-21f7-451d-a7fe-30db31a424aa?sql=SELECT name_engli as label, st_asgeojson(the_geom_simple) as geojson, bbox as bounds from gadm28_countries WHERE iso = '${iso}'`)
      .then(response => response.json());
  }

  /**
   * Get Geostore
   */
  getGeostore(id) {
    return fetch(`${this.opts.apiURL}/geostore/${id}`)
      .then(response => response.json());
  }
}
