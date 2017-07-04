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

}
