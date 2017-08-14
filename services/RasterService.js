import 'isomorphic-fetch';

export default class RasterService {
  /**
   * Creates an instance of RasterService.
   * @param {string} dataset - ID of the dataset
   * @param {string} tableName - Name of the table
   */
  constructor(dataset, tableName, provider) {
    if (!dataset || !tableName || !provider) throw new Error('RasterService needs the dataset ID and the table name');
    this.dataset = dataset;
    this.tableName = tableName;
    this.provider = provider;
  }

  /**
   * Return the names of the bands
   * @returns {Promise<string[]>}
   */
  getBandNames() {
    // The only reason to use a promise here is to catch the error
    // TODO: remove the promise when we don't haver the provider check anymore
    return new Promise((resolve) => {
      if (this.provider !== 'gee') {
        throw new Error('Provider not supported yet'); // TODO: support Carto
      }

      fetch(`${process.env.WRI_API_URL}/query/${this.dataset}?sql=SELECT st_metadata(rast) from "${this.tableName}"`)
        .then((response) => {
          if (!response.ok) throw new Error('Unable to fetch the band names');
          return response.json();
        })
        .then(({ data }) => resolve(data[0].bands.map(b => b.id)));
    });
  }

  /**
   * Return the data associated to the band
   * @param {string} band 
   * @returns {Promise<object[]>}
   */
  getBandData(band) { // eslint-disable-line class-methods-use-this, no-unused-vars
    // The only reason to use a promise here is to catch the error
    // TODO: remove the promise when we don't haver the provider check anymore
    return new Promise(() => {
      throw new Error('The data associated with the band can\'t be retrieved yet');
    });
  }
}
