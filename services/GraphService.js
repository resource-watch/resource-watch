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
    return fetch(`${this.opts.apiURL}/graph/query/list-concepts`)
      .then(response => response.json())
      .then(response => response.data);
  }
  /**
   * Get inferred tags
   */
  getInferredTags(tags) {
    return fetch(`${this.opts.apiURL}/graph/query/concepts-inferred?concepts=${tags}`)
      .then(response => response.json())
      .then(response => response.data);
  }
}
