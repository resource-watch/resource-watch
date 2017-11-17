import 'isomorphic-fetch';
import Promise from 'bluebird';

// Utils
import { getSimplifiedFieldType } from 'components/widgets/editor/helpers/WidgetHelper';

/**
 * Dataset service
 * @example:
    import DatasetService from '..path';
    const ds = new DatasetService('42de3f98-ba1c-4572-a227-2e18d45239a5', {
      apiURL: 'https://api.resourcewatch.org/v1'
    });
    ds.getFilters().then((data) => {
      console.log(data)
    });
 */
export default class DatasetService {
  constructor(datasetId, options) {
    if (!options) {
      throw new Error('options params is required.');
    }

    if (!options.apiURL || options.apiURL === '') {
      throw new Error('options.apiURL param is required.');
    }

    if (!options.language) {
      throw new Error('options.language param is required.');
    }

    this.datasetId = datasetId;
    this.opts = options;
  }

  /**
   * Get subscribable datasets
   */
  getSubscribableDatasets(includes = '') {
    return fetch(`${this.opts.apiURL}/dataset?application=${[process.env.APPLICATIONS]}&language=${this.opts.language}&includes=${includes}&subscribable=true&page[size]=999`)
      .then((response) => {
        if (response.status >= 400) throw new Error(response.statusText);
        return response.json();
      })
      .then(jsonData => jsonData.data);
  }

  /**
   * Get dataset info
   * @returns {Promise}
   */
  fetchData(includes = '', applications = [process.env.APPLICATIONS]) {
    return fetch(`${this.opts.apiURL}/dataset/${this.datasetId}?application=${applications.join(',')}&language=${this.opts.language}&includes=${includes}&page[size]=999`)
      .then((response) => {
        if (response.status >= 400) throw new Error(response.statusText);
        return response.json();
      })
      .then(jsonData => jsonData.data);
  }

  /**
   * Get filtered data
   * @returns {Promise}
   */
  fetchFilteredData(query) {
    return fetch(`${this.opts.apiURL}/query/${this.datasetId}?${query}`)
      .then((response) => {
        if (response.status >= 400) throw new Error(response.statusText);
        return response.json();
      })
      .then(jsonData => jsonData.data);
  }

  /**
   * Get Jiminy chart suggestions
   * NOTE: the API might be really slow to give a result (or even fail
   * to do so) so a timeout is necessary
   * @param {string} query - SQL query to pass to Jiminy
   * @param {number} [timeout=10000] Timeout before rejecting the provise
   * @returns {Promise<any>}
   */
  fetchJiminy(query) {
    return fetch(`${this.opts.apiURL}/jiminy`, {
      method: 'POST',
      body: JSON.stringify({ sql: query }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (response.status >= 400) throw new Error(response.statusText);
        return response.json();
      })
      .then(jsonData => jsonData.data);
  }


  /**
   *  Get max and min or values depending on field type
   *  @returns {Promise}
   */
  getFilter(fieldData) {
    return new Promise((resolve) => {
      const newFieldData = fieldData;
      if (fieldData.type === 'number' || fieldData.type === 'date') {
        this.getMinAndMax(fieldData.columnName, fieldData.tableName, fieldData.geostore).then((data) => {
          newFieldData.properties = data;
          resolve(newFieldData);
        });
      } else {
        this.getValues(fieldData.columnName, fieldData.tableName).then((data) => {
          newFieldData.properties = data;
          resolve(newFieldData);
        });
      }
    });
  }

  /**
   * Returns the list of fields of the dataset
   * @returns {{ columnName: string, columnType: string }[]}
   */
  getFields() {
    return fetch(`${this.opts.apiURL}/fields/${this.datasetId}`)
      .then((response) => {
        if (response.status >= 400) throw new Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        /** @type {{ [field: string]: { type: string } }} */
        const fieldToType = data.fields;

        return Object.keys(fieldToType)
          .map((field) => {
            // We make sure the type of the field is the simplified
            // version of it
            const columnType = getSimplifiedFieldType(fieldToType[field].type);
            if (!columnType) return null;

            return {
              columnName: field,
              columnType
            };
          })
          // We filter out the fields whose type is not supported
          .filter(f => !!f);
      });
  }

  getMinAndMax(columnName, tableName, geostore) {
    if (!this.tableName && !tableName) {
      throw Error('tableName was not specified.');
    }
    const table = tableName || this.tableName;
    const query = `SELECT min(${columnName}) AS min, max(${columnName}) AS max FROM ${table}`;
    const qGeostore = (geostore) ? `&geostore=${geostore}` : '';

    return new Promise((resolve) => {
      // TODO: remove cache param
      fetch(`https://api.resourcewatch.org/v1/query/${this.datasetId}?sql=${query}${qGeostore}`)
        .then((response) => {
          if (!response.ok) throw new Error(response.statusText);
          return response.json();
        })
        .then((jsonData) => {
          if (jsonData.data) {
            resolve(jsonData.data[0]);
          } else {
            resolve({});
          }
        });
    });
  }

  getValues(columnName, tableName, uniqs = true) {
    if (!this.tableName && !tableName) {
      throw Error('tableName was not specified.');
    }
    const table = tableName || this.tableName;
    const uniqQueryPart = uniqs ? `GROUP BY ${columnName}` : '';
    const query = `SELECT ${columnName} FROM ${table} ${uniqQueryPart} ORDER BY ${columnName}`;
    return new Promise((resolve) => {
      // TODO: remove cache param
      fetch(`https://api.resourcewatch.org/v1/query/${this.datasetId}?sql=${query}`)
        .then((response) => {
          if (response.status >= 400) throw new Error(response.statusText);
          return response.json();
        })
        .then((jsonData) => {
          const parsedData = (jsonData.data || []).map(data => data[columnName]);
          resolve(parsedData);
        });
    });
  }

  getLayers() {
    return fetch(`${this.opts.apiURL}/dataset/${this.datasetId}/layer?application=${[process.env.APPLICATIONS]}`)
      .then((response) => {
        if (response.status >= 400) throw new Error(response.statusText);
        return response.json();
      })
      .then(jsonData => jsonData.data);
  }

  getDownloadURI(tableName, datasetName) {
    // emulates trigger of download creating a link in memory and clicking on it
    const a = document.createElement('a');
    a.href = `${this.opts.apiURL}/download/${this.datasetId}?sql=SELECT * FROM ${tableName}`;
    a.style.display = 'none';
    a.download = datasetName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  getSimilarDatasets() {
    return fetch(`${this.opts.apiURL}/graph/query/similar-dataset/${this.datasetId}?application=${[process.env.APPLICATIONS]}`)
      .then((response) => {
        if (response.status >= 400) throw new Error(response.statusText);
        return response.json();
      })
      .then(jsonData => jsonData.data);
  }

  /**
   * Fetch several datasets at once
   * @static
   * @param {string[]} datasetIDs - List of dataset IDs
   * @param {string} language - Two-letter locale
   * @param {string} [includes=''] - List of entities to fetch
   * (string of values separated with commas)
   * @param {string[]} [applications=[process.env.APPLICATIONS]] List of applications
   * @returns {object[]}
   */
  static getDatasets(datasetIDs, language, includes = '', applications = [process.env.APPLICATIONS]) {
    return fetch(`${process.env.WRI_API_URL}/dataset/?ids=${datasetIDs}&language=${language}&includes=${includes}&application=${applications.join(',')}&page[size]=999`)
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then(jsonData => jsonData.data);
  }

  searchDatasetsByConcepts(topics, geographies, dataTypes) {
    let counter = 0;
    const topicsSt = (topics || []).map((val, index) => `concepts[${counter}][${index}]=${val}`).join('&');
    counter++;
    const geographiesSt = (geographies || []).map((val, index) => `concepts[${counter}][${index}]=${val}`).join('&');
    counter++;
    const dataTypesSt = (dataTypes || []).map((val, index) => `concepts[${counter}][${index}]=${val}`).join('&');
    const querySt = `&${topicsSt}${geographiesSt}${dataTypesSt}`;


    return fetch(`${this.opts.apiURL}/graph/query/search-datasets?${querySt}&application=${[process.env.APPLICATIONS]}`)
      .then((response) => {
        if (response.status >= 400) throw new Error(response.statusText);
        return response.json();
      })
      .then(jsonData => jsonData.data);
  }
}
