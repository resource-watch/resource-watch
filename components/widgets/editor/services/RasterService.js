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
    let query;
    if (this.provider === 'gee') {
      query = `SELECT st_metadata(rast) from "${this.tableName}"`;
    } else if (this.provider === 'cartodb') {
      query = `SELECT (st_metadata(st_union(the_raster_webmercator))).* from ${this.tableName}`;
    }

    return fetch(`${process.env.WRI_API_URL}/query/${this.dataset}?sql=${query}`)
      .then((response) => {
        if (!response.ok) throw new Error('Unable to fetch the band names');
        return response.json();
      })
      .then(({ data }) => {
        if (this.provider === 'gee') {
          return data[0].bands.map(b => b.id);
        } else if (this.provider === 'cartodb') {
          return Array.from({ length: data[0].numbands }, (_, i) => `Band ${i + 1}`);
        }

        throw new Error('Unsupported provider');
      });
  }

  /**
   * Return the ChartInfo object for a raster chart
   * @static
   * @returns {ChartInfo}
   */
  static getChartInfo() {
    return {
      chartType: 'bar',
      limit: 500,
      order: null,
      filters: [],
      areaIntersection: null,
      x: {
        type: null,
        name: 'x',
        alias: null
      },
      y: {
        type: null,
        name: 'y',
        alias: null
      }
    };
  }
}
