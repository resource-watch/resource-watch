import 'isomorphic-fetch';

export default class WidgetService {
  constructor(widgetId, options) {
    if (!options) throw new Error('options params is required.');
    if (!options.apiURL || options.apiURL === '') throw new Error('options.apiURL param is required.');

    this.widgetId = widgetId;
    this.opts = options;
  }

  fetchData(includes = '') {
    return fetch(
      `${this.opts.apiURL}/widget/${this.widgetId}?includes=${includes}&page[size]=999&application=${process.env.APPLICATIONS}&env=${process.env.API_ENV}`,
      {
        method: 'GET',
        headers: { 'Upgrade-Insecure-Requests': 1 }
      }
    )
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          const error = (data && data.errors && data.errors.length && data.errors[0].detail)
            || 'Failed to load the data';
          throw new Error(error);
        }

        return data;
      })
      .then(jsonData => jsonData.data);
  }

  saveUserWidget(widget, datasetId, token) {
    const widgetObj = {
      application: [process.env.APPLICATIONS],
      // env: process.env.API_ENV, This is commented out since otherwise the widget ends up
      // having a env value equals to `production,preproduction`, which is not allowed.
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
}
