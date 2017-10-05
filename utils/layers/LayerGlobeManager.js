import { substitution } from 'utils/utils';

export default class LayerGlobeManager {
  // Constructor
  constructor(map, defaults = {}) {
    this.map = map;
    this.layer = {};
    this.defaults = defaults;
  }

  /*
    Public methods
  */
  addLayer(layer, opts = {}) {
    const method = { cartodb: this.addCartoLayer }[layer.provider];

    // Check for active request to prevent adding more than one layer at a time
    this.abortRequest();

    return method && method.call(this, layer, opts);
  }

  /**
   * PRIVATE METHODS
   * - abortRequest
   * - addCartoLayer
  */
  abortRequest() {
    if (this.layer.request) {
      if (this.layer.request.readyState !== 4) {
        // Abort the request && reset the layer
        this.layer.request.abort();
        this.layer = {};
      }
    }
  }

  addCartoLayer(layer, opts) {
    // Set the layer && opts
    this.layer = {
      ...layer,
      options: opts
    };

    const { layerConfig } = this.layer;
    const { pulseConfig, account } = layerConfig;

    const newLayersObj = layerConfig.body.layers;
    newLayersObj[0].options.sql = pulseConfig.sql;

    const layerTpl = {
      version: '1.3.0',
      stat_tag: 'API',
      layers: newLayersObj
    };
    const params = `?stat_tag=API&config=${encodeURIComponent(JSON.stringify(layerTpl))}`;
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', `https://${account}.carto.com/api/v1/map${params}`);

    // ...and add it to the current layer
    this.layer.request = xmlhttp;

    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200) {
          const data = JSON.parse(xmlhttp.responseText);
          const { urlTemplate, values } = pulseConfig;
          const { bbox, format, height, width } = values;

          // Parse the staticImageConfig.urlTemplate with the current options
          const texture = substitution(urlTemplate, [{
            key: 'account',
            value: layerConfig.account
          }, {
            key: 'token_groupid',
            value: data.layergroupid
          }, {
            key: 'bbox',
            value: bbox.join(',')
          }, {
            key: 'format',
            value: format
          }, {
            key: 'width',
            value: width
          }, {
            key: 'height',
            value: height
          }]);
          this.layer.options.onLayerAddedSuccess(texture);
        } else {
          this.layer.options.onLayerAddedError('Error or canceled');
        }
      }
    };
    xmlhttp.send(null);
  }
}
