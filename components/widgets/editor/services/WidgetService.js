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
      application: [process.env.APPLICATIONS],
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

  getUserWidgets(userId, sortByUpdatedAt = true, direction = 'asc', includes = '') {
    const directionPart = (direction === 'asc') ? '&sort=updatedAt' : '&sort=-updatedAt';
    const sortSt = sortByUpdatedAt ? directionPart : '';
    return fetch(`${this.opts.apiURL}/widget/?userId=${userId}${sortSt}&includes=${includes}&env=production,preproduction&page[size]=999`)
      .then(response => response.json())
      .then(jsonData => jsonData.data);
  }

  getUserWidgetCollections(user) {
    return fetch(`${this.opts.apiURL}/vocabulary/widget_collections?application=rw`)
      .then(response => response.json())
      .then((jsonData) => {
        const dataObj = jsonData.data;
        const result = [];
        if (dataObj.length) {
          const widgets = dataObj[0].attributes.resources
            .filter(val => val.type === 'widget')
            .map(val => ({ id: val.id, tags: val.tags }))
            .filter(val => val.tags.find(tag => tag.startsWith(user.id)));
          return widgets;
        }
        return result;
      });
  }

  updateWidgetCollections(user, widget, widgetCollections, method = 'PATCH') {
    const bodyObj = {
      tags: widgetCollections.map(val => `${user.id}-${val}`)
    };
    return fetch(`${this.opts.apiURL}/dataset/${widget.attributes.dataset}/widget/${widget.id}/vocabulary/widget_collections`, {
      method,
      body: method === 'DELETE' ? '' : JSON.stringify(bodyObj),
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      }
    })
      .then(response => response.json());
  }
}
