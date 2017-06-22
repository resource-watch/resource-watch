import 'isomorphic-fetch';
import _ from 'lodash';
import Promise from 'bluebird';

export default class DatasetService {

  constructor(options) {
    if (!options) {
      throw new Error('options params is required.');
    }
    if (!options.apiURL || options.apiURL === '') {
      throw new Error('options.apiURL param is required.');
    }
    this.opts = options;
  }

  /**
   * Gets the user that is currently logged
   * @returns {Promise}
   */
  getLoggedUser() {
    return new Promise((resolve) => {
      fetch(`${this.opts.apiURL}/auth/check-logged`)
        .then(response => response.json())
        .then(jsonData => resolve(jsonData.data));
    });
  }

}
