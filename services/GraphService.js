import 'isomorphic-fetch';

export default class GraphService {
  constructor(options) {
    this.opts = options;
  }

  /**
   * Get all tags
   */
  getAllTags() {
    return fetch(
      `${process.env.WRI_API_URL}/graph/query/list-concepts?application=${process.env.APPLICATIONS}`,
      { headers: { 'Upgrade-Insecure-Requests': 1 } }

    )
      .then(response => response.json())
      .then(response => response.data);
  }
  /**
   * Get inferred tags
   */
  getInferredTags(tags) {
    return fetch(
      `${process.env.WRI_API_URL}/graph/query/concepts-inferred?concepts=${tags}&application=${process.env.APPLICATIONS}`,
      { headers: { 'Upgrade-Insecure-Requests': 1 } }

    )
      .then(response => response.json())
      .then(response => response.data);
  }

  /**
  * Get dataset tags
  */
  getDatasetTags(datasetId) {
    return fetch(
      `${process.env.WRI_API_URL}/dataset/${datasetId}/vocabulary?application=${process.env.APPLICATIONS}`,
      { headers: { 'Upgrade-Insecure-Requests': 1 } }

    )
      .then(response => response.json())
      .then(response => response.data);
  }

  /**
  * Update dataset tags
  */
  updateDatasetTags(datasetId, tags, token, usePatch = false) {
    let bodyObj = {
      knowledge_graph: {
        tags,
        application: process.env.APPLICATIONS
      }
    };
    let method = tags.length > 0 ? 'PUT' : 'DELETE';
    let url = `${process.env.WRI_API_URL}/dataset/${datasetId}/vocabulary`;

    if (usePatch) {
      method = 'PATCH';
      bodyObj = { tags, application: process.env.APPLICATIONS };
      url = `${url}/knowledge_graph`;
    }

    if (method === 'DELETE') {
      url = `${url}/knowledge_graph?application=${process.env.APPLICATIONS}`;
      bodyObj = {};
    }

    return fetch(url, {
      method,
      body: JSON.stringify(bodyObj),
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    })
      .then(response => response.json())
      .then(jsonData => jsonData.data);
  }

  /**
   * Send a request to count a view to the dataset
   * @param {string} datasetId Dataset ID
   * @param {string} [token] User token
   * @returns {Promise<void>}
   */
  countDatasetView(datasetId, token) {
    const headers = {};

    if (token) {
      headers.Authorization = token;
    }

    return fetch(`${process.env.WRI_API_URL}/graph/dataset/${datasetId}/visited?application=${process.env.APPLICATIONS}`, {
      method: 'POST',
      headers
    })
      .then(res => res.json());
  }

  /**
   * Get the list of most viewed datasets
   * @returns {Promise<string[]>} List of sorted ids
   */
  getMostViewedDatasets() {
    return fetch(
      `${process.env.WRI_API_URL}/graph/query/most-viewed?application=${process.env.APPLICATIONS}`,
      { headers: { 'Upgrade-Insecure-Requests': 1 } }

    )
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Unable to fetch the most viewed datasets');
      })
      .then(res => res.data.map(d => d.dataset));
  }

  /**
   * Get the list of most favourited datasets
   * @returns {Promise<string[]>} List of sorted ids
   */
  getMostFavoritedDatasets() {
    return fetch(
      `${process.env.WRI_API_URL}/graph/query/most-liked-datasets?application=${process.env.APPLICATIONS}`,
      { headers: { 'Upgrade-Insecure-Requests': 1 } }

    )
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Unable to fetch the most favourited datasets');
      })
      .then(res => res.data.map(d => d.id));
  }
}
