import 'isomorphic-fetch';

export default class WidgetService {
  constructor(widgetId, options) {
    if (!options) throw new Error('options params is required.');
    if (!options.apiURL || options.apiURL === '') throw new Error('options.apiURL param is required.');

    this.widgetId = widgetId;
    this.opts = options;
  }

  fetchData(includes = '') {
    return fetch(`${this.opts.apiURL}/widget/${this.widgetId}?includes=${includes}&page[size]=999`)
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
      .then(response => response.json());
  }

  updateUserWidget(widget, datasetId, token) {
    return fetch(`${this.opts.apiURL}/dataset/${datasetId}/widget/${widget.id}`, {
      method: 'PATCH',
      body: JSON.stringify(widget),
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    })
      .then(response => response.json());
  }

  removeUserWidget(widgetId, token) {
    return fetch(`${this.opts.apiURL}/widget/${widgetId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    })
      .then(response => response.json());
  }

  getUserWidgets(userId, sortByUpdatedAt = true, direction = 'asc') {
    const directionPart = (direction === 'asc') ? '&sort=updatedAt' : '&sort=-updatedAt';
    const sortSt = sortByUpdatedAt ? directionPart : '';
    return fetch(`${this.opts.apiURL}/widget/?userId=${userId}${sortSt}`)
      .then(response => response.json())
      .then(jsonData => jsonData.data);
  }

  getUserWidgetCollections(userId) {
    return fetch(`${this.opts.apiURL}/vocabulary/widget_collections?application=rw`)
      .then(response => response.json())
      .then(jsonData => jsonData.data);
  }
}
