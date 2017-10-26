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

  addCartoLayer(layerSpec, opts) {
    const layer = Object.assign({}, layerSpec.layerConfig, {
      id: layerSpec.id,
      order: layerSpec.order,
      opacity: layerSpec.opacity,
      hidden: layerSpec.hidden
    });

    const layerTpl = {
      version: '1.3.0',
      stat_tag: 'API',
      layers: layer.body.layers
    };
    const params = `?stat_tag=API&config=${encodeURIComponent(JSON.stringify(layerTpl))}`;

    fetch(`https://${layer.account}.carto.com/api/v1/map${params}`)
      .then((response) => {
        if (response.status >= 400) {
          this.rejectLayersLoading = true;
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        // const tileUrl = `https://${layer.account}.carto.com/api/v1/map/${data.layergroupid}/{z}/{x}/{y}.png`;
        const tileUrl = `${data.cdn_url.templates.https.url}/${layer.account}/api/v1/map/${data.layergroupid}/{z}/{x}/{y}.png`;

        opts.onLayerAddedSuccess(tileUrl);
      });
  }
}
