import 'isomorphic-fetch';
import _ from 'lodash';
import Promise from 'bluebird';

/**
 * Dataset service
 * @example:
    import DatasetService from '..path';
    const ds = new DatasetService('42de3f98-ba1c-4572-a227-2e18d45239a5', {
      apiURL: '${process.env.WRI_API_URL}'
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
  fetchData() {
    return new Promise((resolve) => {
      fetch(`${this.opts.apiURL}/dataset/${this.datasetId}`)
        .then(response => response.json())
        .then(jsonData => resolve(jsonData.data));
    });
  }

  /**
   * Get filtered data
   * @returns {Promise}
   */
  fetchFilteredData(query) {
    return new Promise((resolve) => {
      fetch(`${this.opts.apiURL}/query/${this.datasetId}?sql=${query}`)
        .then(response => response.json())
        .then(jsonData => resolve(jsonData.data));
    });
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
        const filteredFields = fieldsData.fields.filter((field) => {
          return field.columnType === 'number' || field.columnType === 'date' ||
            field.columnType === 'string';
        });
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
    return new Promise((resolve) => {
      fetch(`${this.opts.apiURL}/fields/${this.datasetId}`)
        .then(response => response.json())
        .then((jsonData) => {
          const parsedData = {
            tableName: jsonData.tableName,
            fields: _.map(jsonData.fields, (value, key) => ({
              columnName: key,
              columnType: value.type
            }))
          };
          resolve(parsedData);
        });
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
      fetch(`${process.env.WRI_API_URL}/query/${this.datasetId}?sql=${query}&cache=${Date.now()}`)
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
      fetch(`${process.env.WRI_API_URL}/query/${this.datasetId}?sql=${query}&cache=${Date.now()}`)
        .then(response => response.json())
        .then((jsonData) => {
          const parsedData = _.map(jsonData.data, data => data[columnName]);
          resolve(parsedData);
        });
    });
  }
}
