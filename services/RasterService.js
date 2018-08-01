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

    return fetch(
      `${process.env.WRI_API_URL}/query/${this.dataset}?sql=${query}`,
      { headers: { 'Upgrade-Insecure-Requests': 1 } }

    )
      .then((response) => {
        if (!response.ok) throw new Error('Unable to fetch the band names');
        return response.json();
      })
      .then(({ data }) => {
        if (this.provider === 'gee') {
          return data[0].bands.map(b => b.id);
        } else if (this.provider === 'cartodb') {
          return Array.from({ length: data[0].numbands }, (_, i) => `${i + 1}`);
        }

        throw new Error('Unsupported provider');
      });
  }

  /**
   * Return the statistical information of a band
   * @param {string} bandName Name of the band
   * @returns {Promise<object>}
   */
  getBandStatsInfo(bandName) {
    return new Promise((resolve, reject) => {
      // First we build the query
      let query;
      if (this.provider === 'gee') {
        // If we already have cached the information about all the bands
        // we don't fetch it again
        if (this.geeBandStatInfo) {
          return resolve(this.geeBandStatInfo[bandName]);
        }

        query = `SELECT ST_SUMMARYSTATS() from '${this.tableName}'`;
      } else if (this.provider === 'cartodb') {
        query = `select (ST_SummaryStatsAgg(the_raster_webmercator, ${bandName}, True)).* from ${this.tableName}`;
      } else {
        // We don't support this provider yet
        reject();
      }

      // We now fetch the actual data
      return fetch(
        `https://api.resourcewatch.org/v1/query/${this.dataset}?sql=${query}`,
        { headers: { 'Upgrade-Insecure-Requests': 1 } }

      )
        .then((res) => {
          if (!res.ok) reject();
          return res.json();
        })
        .then((data) => {
          if (this.provider === 'gee') {
            // We cache the data because the information of all the
            // bands comes at once
            this.geeBandStatInfo = data.data[0];

            resolve(this.geeBandStatInfo[bandName]);
          } else if (this.provider === 'cartodb') {
            resolve(data.data[0]);
          }
        })
        .catch(reject);
    });
  }

  /**
   * Return the ChartInfo object for a raster chart
   * @static
   * @param {object} widgetEditor - Store object
   * @returns {ChartInfo}
   */
  static getChartInfo(widgetEditor) {
    const { areaIntersection } = widgetEditor;

    return {
      chartType: 'bar',
      limit: 500,
      order: null,
      filters: [],
      areaIntersection,
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
