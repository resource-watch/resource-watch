import 'isomorphic-fetch';
import WRISerializer from 'wri-json-api-serializer';

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
   * Get dataset info
   * @returns {Promise}
   */
  fetchData(includes = '', applications = [process.env.APPLICATIONS]) {
    const url = `${this.opts.apiURL}/dataset/${this.datasetId}?application=${applications.join(',')}&env=${process.env.API_ENV}&language=${this.opts.language}&includes=${includes}&page[size]=999`;
    return fetch(
      url,
      {
        method: 'GET',
        headers: { 'Upgrade-Insecure-Requests': 1 }
      }
    )
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
    const url = `${this.opts.apiURL}/dataset/${this.datasetId}?application=${applications.join(',')}&env=${process.env.API_ENV}&language=${this.opts.language}&includes=${includes}&page[size]=999`;
    return fetch(
      url,
      { headers: { 'Upgrade-Insecure-Requests': 1 } }
    )
      .then((response) => {
        if (response.status >= 400) throw Error(response.statusText);
        return response.json();
      })
      .then(body => WRISerializer(body));
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


    return fetch(
      `${this.opts.apiURL}/graph/query/search-datasets?${querySt}&published=true&env=${process.env.API_ENV}&application=${process.env.APPLICATIONS}&page[size]=999999`,
      { headers: { 'Upgrade-Insecure-Requests': 1 } }

    )
      .then((response) => {
        if (response.status >= 400) throw new Error(response.statusText);
        return response.json();
      })
      .then(jsonData => jsonData.data);
  }
}
