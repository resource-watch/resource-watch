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
}
