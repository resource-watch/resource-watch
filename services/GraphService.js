import 'isomorphic-fetch';

export default class GraphService {
  constructor(options) {
    if (!options) throw new Error('options params is required.');
    if (!options.apiURL || options.apiURL === '') throw new Error('options.apiURL param is required.');
    this.opts = options;
  }

  /**
   * Get all tags
   */
  getAllTags() {
    return fetch(`${this.opts.apiURL}/graph/query/list-concepts?application=${[process.env.APPLICATIONS]}`)
      .then(response => response.json())
      .then(response => response.data);
  }
  /**
   * Get inferred tags
   */
  getInferredTags(tags) {
    return fetch(`${this.opts.apiURL}/graph/query/concepts-inferred?concepts=${tags}&application=${[process.env.APPLICATIONS]}`)
      .then(response => response.json())
      .then(response => response.data);
  }

  /**
  * Get dataset tags
  */
  getDatasetTags(datasetId) {
    return fetch(`${this.opts.apiURL}/dataset/${datasetId}/vocabulary?application=${[process.env.APPLICATIONS]}`)
      .then(response => response.json())
      .then(response => response.data);
  }

  /**
  * Update dataset tags
  */
  updateDatasetTags(datasetId, tags, token) {
    const bodyObj = {
      knowledge_graph: {
        tags
      }
    };
    return fetch(`${this.opts.apiURL}/dataset/${datasetId}/vocabulary`, {
      method: 'PUT',
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

    return fetch(`${this.opts.apiURL}/graph/dataset/${datasetId}/visited`, {
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
    return fetch(`${this.opts.apiURL}/graph/query/most-viewed`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Unable to fetch the most viewed datasets');
      })
      .then(res => res.data.map(d => d.dataset));
  }

  /**
   * Get the list of most favorited datasets
   * @returns {Promise<string[]>} List of sorted ids
   */
  getMostFavoritedDatasets() {
    return fetch(`${this.opts.apiURL}/graph/query/most-liked-datasets`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Unable to fetch the most favorited datasets');
      })
      .then(res => res.data.map(d => d.id));
  }
}
