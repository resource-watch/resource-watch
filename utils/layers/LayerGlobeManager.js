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
  addLayer(layer, opts = {}, awaitMode = false) {
    const method = {
      cartodb: this.addCartoLayer,
      leaflet: this.addLeafletLayer,
      gee: this.addGeeLayer
    }[layer.provider];

    // Check for active request to prevent adding more than one layer at a time
    this.abortRequest();

    return method && method.call(this, layer, opts, awaitMode);
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

  addLeafletLayer(layerSpec, opts) {
    opts.onLayerAddedSuccess({
      attributes: { ...layerSpec },
      url: layerSpec.layerConfig.url,
      active: false
    });
  }

  addGeeLayer(layerSpec, opts) {
    opts.onLayerAddedSuccess({
      attributes: { ...layerSpec },
      url: `${process.env.WRI_API_URL}/layer/${layerSpec.id}/tile/gee/{z}/{x}/{y}`,
      active: false
    });
  }

  async addCartoLayer(layerSpec, opts, awaitMode = false) {
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

    const f = fetch(`https://${layer.account}.carto.com/api/v1/map${params}`)
      .then((response) => {
        if (response.status >= 400) {
          this.rejectLayersLoading = true;
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        const tileUrl = `${data.cdn_url.templates.https.url}/${layer.account}/api/v1/map/${data.layergroupid}/{z}/{x}/{y}.png`;

        opts.onLayerAddedSuccess({
          ...layerSpec,
          url: tileUrl,
          active: false
        });
      });

    if (awaitMode) {
      await f;
    }
  }
}
