import 'isomorphic-fetch';
import _ from 'lodash';
import Promise from 'bluebird';

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
    this.datasetId = datasetId;
    this.opts = options;
  }

  /**
   * Get dataset info
   * @returns {Promise}
   */
  fetchData(includes = '') {
    return fetch(`${this.opts.apiURL}/dataset/${this.datasetId}?includes=${includes}`)
      .then(response => response.json())
      .then(jsonData => jsonData.data);
  }

  /**
   * Get filtered data
   * @returns {Promise}
   */
  fetchFilteredData(query) {
    return fetch(`${this.opts.apiURL}/query/${this.datasetId}?sql=${query}`)
      .then(response => response.json())
      .then(jsonData => jsonData.data);
  }

  /**
   * Get Jiminy chart suggestions
   * @returns {Promise}
   */
  fetchJiminy(query) {
    return fetch(`${this.opts.apiURL}/jiminy`, {
      method: 'POST',
      body: JSON.stringify({ sql: query }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(jsonData => jsonData.data);
  }


  /**
   *  Get max and min or values depending on field type
   *  @returns {Promise}
   */
  getFilter(fieldData) {
    return new Promise((resolve) => {
      if (fieldData.columnType === 'number' || fieldData.columnType === 'date') {
        this.getMinAndMax(fieldData.columnName, fieldData.tableName).then((data) => {
          fieldData.properties = data;
          resolve(fieldData);
        });
      } else {
        this.getValues(fieldData.columnName, fieldData.tableName).then((data) => {
          fieldData.properties = data;
          resolve(fieldData);
        });
      }
    });
  }

  getFilters() {
    return new Promise((resolve) => {
      this.getFields().then((fieldsData) => {
        const filteredFields = fieldsData.fields.filter(field => field.columnType === 'number' || field.columnType === 'date' || field.columnType === 'string');
        const promises = _.map(filteredFields, (field) => {
          if (field.columnType === 'number' || field.columnType === 'date') {
            return this.getMinAndMax(field.columnName, fieldsData.tableName);
          }
          return this.getValues(field.columnName, fieldsData.tableName);
        });
        Promise.all(promises).then((results) => {
          const filters = _.map(filteredFields, (field, index) => {
            const filterResult = {
              columnName: field.columnName,
              columnType: field.columnType
            };
            if (field.columnType === 'number' || field.columnType === 'date') {
              filterResult.properties = results[index];
            } else {
              filterResult.properties = {
                values: results[index]
              };
            }
            return filterResult;
          });
          resolve(filters);
        });
      });
    });
  }

  getFields() {
    return fetch(`${this.opts.apiURL}/fields/${this.datasetId}`)
      .then(response => response.json())
      .then((jsonData) => {
        const parsedData = {
          tableName: jsonData.tableName,
          fields: _.map(jsonData.fields, (value, key) => ({
            columnName: key,
            columnType: value.type
          }))
        };
        return parsedData;
      });
  }

  getMinAndMax(columnName, tableName) {
    if (!this.tableName && !tableName) {
      throw Error('tableName was not specified.');
    }
    const table = tableName || this.tableName;
    const query = `SELECT Min(${columnName}) AS min, Max(${columnName}) AS max FROM ${table}`;
    return new Promise((resolve) => {
      // TODO: remove cache param
      fetch(`https://api.resourcewatch.org/v1/query/${this.datasetId}?sql=${query}`)
        .then(response => response.json())
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
        .then(response => response.json())
        .then((jsonData) => {
          const parsedData = _.map(jsonData.data, data => data[columnName]);
          resolve(parsedData);
        });
    });
  }

  getLayers() {
    return fetch(`${this.opts.apiURL}/dataset/${this.datasetId}/layer`)
      .then(response => response.json())
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
}
