import 'isomorphic-fetch';

function parseDataset(dataset) {
  const d = Object.assign({}, { ...dataset.attributes, id: dataset.id });
  if (d.metadata) {
    const metadata = d.metadata.map(m => ({
      ...m.attributes,
      ...m.attributes.info,
      id: m.id
    }));
    d.metadata = metadata && metadata.length ? metadata[0] : {};
  }
  if (d.widget) d.widgets = d.widget.map(w => ({ ...w.attributes, id: w.id }));
  if (d.layer) d.layer = d.layer.map(l => ({ ...l.attributes, id: l.id }));
  return d;
}

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
      .then(response => response.json())
      .then(jsonData => jsonData.data);
  }

  /**
   * Get dataset info
   * @returns {Promise}
   */
  fetchData(includes = '', applications = [process.env.APPLICATIONS]) {
    const url = `${this.opts.apiURL}/dataset/${this.datasetId}?application=${applications.join(',')}&language=${this.opts.language}&includes=${includes}&page[size]=999`;
    return fetch(url)
      .then((response) => {
        if (response.status >= 400) throw Error(response.statusText);
        return response.json();
      })
      .then(body => body.data);
  }

  /**
   * Get dataset info
   * @returns {Promise}
   */
  fetchDataset(includes = '', applications = [process.env.APPLICATIONS]) {
    const url = `${this.opts.apiURL}/dataset/${this.datasetId}?application=${applications.join(',')}&language=${this.opts.language}&includes=${includes}&page[size]=999`;
    return fetch(url)
      .then((response) => {
        if (response.status >= 400) throw Error(response.statusText);
        return response.json();
      })
      .then(body => parseDataset(body.data));
  }

  /**
   * Get filtered data
   * @returns {Promise}
   */
  fetchFilteredData(query) {
    return fetch(`${this.opts.apiURL}/query/${this.datasetId}?sql=${query}`)
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
   * @returns {Promise<any>}
   */
  fetchJiminy(query) {
    fetch(`${this.opts.apiURL}/jiminy`, {
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
      if (fieldData === 'number' || fieldData === 'date') {
        this.getMinAndMax(fieldData.columnName, fieldData.tableName).then((data) => {
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

  getFields() {
    return fetch(`${this.opts.apiURL}/fields/${this.datasetId}`)
      .then(response => response.json())
      .then((jsonData) => {
        const fieldsObj = jsonData.fields;
        const parsedData = {
          tableName: jsonData.tableName,
          fields: (Object.keys(fieldsObj) || []).map(key => ({
            columnName: key,
            columnType: fieldsObj[key].type
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
        .then((response) => {
          if (response.status >= 400) throw new Error(response.statusText);
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
          const parsedData = (jsonData.data || []).map(data => data[columnName]);
          resolve(parsedData);
        });
    });
  }

  getLayers() {
    return fetch(`${this.opts.apiURL}/dataset/${this.datasetId}/layer?app=rw`)
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

  getSimilarDatasets(withAncestors = true) {
    const endpoint = withAncestors ? 'similar-dataset-including-descendent' : 'similar-dataset';
    return fetch(`${this.opts.apiURL}/graph/query/${endpoint}/${this.datasetId}?published=true&env=${process.env.API_ENV}&application=${[process.env.APPLICATIONS]}&limit=6`)
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
    const topicsSt = topics ? topics.map((val, index) => `concepts[${counter}][${index}]=${val}`).join('&') : null;
    if ((topics || []).length) counter++;
    const geographiesSt = geographies ? `${geographies.map((val, index) => `concepts[${counter}][${index}]=${val}`).join('&')}` : null;
    if ((geographies || []).length) counter++;
    const dataTypesSt = dataTypes ? `${dataTypes.map((val, index) => `concepts[${counter}][${index}]=${val}`).join('&')}` : null;

    let querySt = topicsSt;
    if (geographiesSt) {
      if (querySt) {
        querySt += `&${geographiesSt}`;
      } else {
        querySt = geographiesSt;
      }
    }
    if (dataTypesSt) {
      if (querySt) {
        querySt += `&${dataTypesSt}`;
      } else {
        querySt = dataTypesSt;
      }
    }


    return fetch(`${this.opts.apiURL}/graph/query/search-datasets?${querySt}&published=true&env=${process.env.API_ENV}&application=${[process.env.APPLICATIONS]}&page[size]=999999`)
      .then((response) => {
        if (response.status >= 400) throw new Error(response.statusText);
        return response.json();
      })
      .then(jsonData => jsonData.data);
  }
}
