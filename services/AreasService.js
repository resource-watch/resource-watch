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
    return fetch(`${this.opts.apiURL}/geostore/admin/list`)
      .then(response => response.json())
      .then(array => array.data.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        } else { // eslint-disable-line no-else-return
          return 0;
        }
      }));
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

  createGeostore(geojson) {
    console.log(geojson);
    return fetch(`${this.opts.apiURL}/geostore`, {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify(geojson)
    }).then((response) => {
      if (!response.ok) throw new Error('The file couldn\'t be processed correctly. Try again in a few minutes.');
      return response.json();
    }).then(({ data }) => data.id);
  }
}
