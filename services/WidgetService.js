import 'isomorphic-fetch';

export default class WidgetService {

  constructor(widgetId, options) {
    if (!options) throw new Error('options params is required.');
    if (!options.apiURL || options.apiURL === '') throw new Error('options.apiURL param is required.');

    this.widgetId = widgetId;
    this.opts = options;
  }

  fetchData(includes = '') {
    return fetch(`${this.opts.apiURL}/widget/${this.widgetId}?includes=${includes}`)
      .then(response => response.json())
      .then(jsonData => jsonData.data);
  }

  saveUserWidget(widget, datasetId, token) {
    const widgetObj = {
      application: ['rw'],
      published: false,
      default: false,
      dataset: datasetId
    };
    const bodyObj = Object.assign({}, widget, widgetObj);
    return fetch(`${this.opts.apiURL}/dataset/${datasetId}/widget`, {
      method: 'POST',
      body: JSON.stringify(bodyObj),
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    })
    .then(response => response.json())
    .then(jsonData => jsonData.data);
  }

  getUserWidgets(userId) {
    return fetch(`${this.opts.apiURL}/widget/?userId=${userId}`)
      .then(response => response.json())
      .then(jsonData => jsonData.data);
  }

}
