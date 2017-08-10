/* eslint import/no-unresolved: 0 */
/* eslint import/extensions: 0 */
/* eslint global-require: 0 */

import 'whatwg-fetch';

let L;
if (typeof window !== 'undefined') {
  L = require('leaflet/dist/leaflet');
  // adding support for esri
  const esri = require('esri-leaflet');
  L.esri = esri;
}

export default class LayerManager {

  // Constructor
  constructor(map, options = {}) {
    this.map = map;
    this.mapLayers = {};
    this.layersLoading = {};
    this.rejectLayersLoading = false;
    this.onLayerAddedSuccess = options.onLayerAddedSuccess;
    this.onLayerAddedError = options.onLayerAddedError;
  }

  /*
    Public methods
  */
  addLayer(layer, opts = {}) {
    const method = {
      // legacy/deprecated
      leaflet: this.addLeafletLayer,
      arcgis: this.addEsriLayer,
      // carto
      cartodb: this.addCartoLayer,
      carto: this.addCartoLayer,
      // wms
      wmsservice: this.addLeafletLayer,
      wms: this.addLeafletLayer,
      // arcgis
      featureservice: this.addEsriLayer,
      mapservice: this.addEsriLayer,
      tileservice: this.addEsriLayer,
      esrifeatureservice: this.addEsriLayer,
      esrimapservice: this.addEsriLayer,
      esritileservice: this.addEsriLayer,
      // geojson
      geojson: this.addGeoJsonLayer
    }[layer.provider];

    if (method) method.call(this, layer, opts);

    this.execCallback()
      .then(() => {
        if (this.onLayerAddedSuccess) this.onLayerAddedSuccess();
      })
      .catch(() => {
        this.layersLoading = {};
        this.rejectLayersLoading = false;
        if (this.onLayerAddedError) this.onLayerAddedError();
      });
  }

  removeLayer(layerId) {
    if (this.mapLayers[layerId]) {
      this.map.removeLayer(this.mapLayers[layerId]);
      delete this.mapLayers[layerId];
    }
  }

  removeLayers() {
    Object.keys(this.mapLayers).forEach((id) => {
      if (this.mapLayers[id]) {
        this.map.removeLayer(this.mapLayers[id]);
        delete this.mapLayers[id];
      }
    });
    this.layersLoading = {};
  }

  /*
    Private methods
  */
  execCallback() {
    return new Promise((resolve, reject) => {
      const loop = () => {
        if (!Object.keys(this.layersLoading).length) return resolve();
        if (this.rejectLayersLoading) return reject();
        return setTimeout(loop);
      };
      return setTimeout(loop);
    });
  }

  addGeoJsonLayer(layer) {
    const geojsonLayer = L.geoJSON(layer.layerConfig.data).addTo(this.map);
    this.mapLayers[layer.id] = geojsonLayer;

    if (layer.layerConfig.fitBounds) {
      const bounds = geojsonLayer.getBounds();
      this.map.fitBounds([
        bounds.getNorthWest(),
        bounds.getSouthEast()
      ], { padding: [20, 20] });
    }
  }

  addLeafletLayer(layerSpec, { zIndex }) {
    const layerData = layerSpec.layerConfig;

    let layer;

    layerData.id = layerSpec.id;
    this.layersLoading[layerData.id] = true;

    // Transforming data layer
    // TODO: improve this
    if (layerData.body.crs && L.CRS[layerData.body.crs]) {
      layerData.body.crs = L.CRS[layerData.body.crs.replace(':', '')];
      layerData.body.pane = 'tilePane';
    }

    switch (layerData.type) {
      case 'wms':
        layer = new L.tileLayer.wms(layerData.url, layerData.body); // eslint-disable-line
        break;
      case 'tileLayer':
        if (layerData.body.style &&
            typeof layerData.body.style === 'string' &&
            layerData.body.indexOf('style: "function') >= 0) {
          layerData.body.style = eval(`(${layerData.body.style})`); // eslint-disable-line
        }
        layer = new L.tileLayer(layerData.url, layerData.body); // eslint-disable-line
        break;
      default:
        delete this.layersLoading[layerData.id];
        throw new Error('"type" specified in layer spec doesn`t exist');
    }

    if (layer) {
      const eventName = (layerData.type === 'wms' ||
      layerData.type === 'tileLayer') ? 'tileload' : 'load';
      layer.on(eventName, () => {
        delete this.layersLoading[layerData.id];
      });
      if (zIndex) {
        layer.setZIndex(zIndex);
      }
      this.mapLayers[layerData.id] = layer;
    }
  }

  addEsriLayer(layerSpec, { zIndex }) {
    const layer = layerSpec.layerConfig;
    const layerData = layerSpec.layerConfig;
    layer.id = layerSpec.id;

    this.layersLoading[layer.id] = true;
    // Transforming layer
    // TODO: change this please @ra
    const bodyStringified = JSON.stringify(layer.body || {})
      .replace(/"mosaic-rule":/g, '"mosaicRule":')
      .replace(/"use-cors"/g, '"useCors"');

    // first, we check if layer exist in leaflet
    if (L[layer.type]) {
      if (layerData.body.style &&
          typeof layerData.body.style === 'string' &&
          layerData.body.indexOf('style: "function') >= 0) {
        layerData.body.style = eval(`(${layerData.body.style})`); // eslint-disable-line
      }
      const newLayer = new L.tileLayer(layerData.url, layerData.body); // eslint-disable-line

      let layerElement;

      newLayer.on('load', () => {
        delete this.layersLoading[layer.id];
        layerElement = this.map.getPane('tilePane').lastChild;
        if (zIndex) {
          layerElement.style.zIndex = zIndex;
        }
        layerElement.id = layer.id;
      });

      newLayer.addTo(this.map);

      // This method is called in setZIndex
      newLayer.setZIndex = (index) => {
        layerElement.style.zIndex = index;
      };

      this.mapLayers[layer.id] = newLayer;
    } else if (L.esri[layer.type]) {
      const layerConfig = JSON.parse(bodyStringified);
      layerConfig.pane = 'tilePane';
      if (layerConfig.style &&
        layerConfig.style.indexOf('function') >= 0) {
        layerConfig.style = eval(`(${layerConfig.style})`); // eslint-disable-line
      }
      const newLayer = L.esri[layer.type](layerConfig);

      let layerElement;

      newLayer.on('load', () => {
        delete this.layersLoading[layer.id];
        layerElement = this.map.getPane('tilePane').lastChild;
        if (zIndex) {
          layerElement.style.zIndex = zIndex;
        }
        layerElement.id = layer.id;
      });

      newLayer.addTo(this.map);

      // This method is called in setZIndex
      newLayer.setZIndex = (index) => {
        layerElement.style.zIndex = index;
      };

      this.mapLayers[layer.id] = newLayer;
    } else {
      this.rejectLayersLoading = true;
      throw new Error('"type" specified in layer spec doesn`t exist');
    }
  }

  addCartoLayer(layerSpec) {
    const layer = Object.assign({}, layerSpec.layerConfig, {
      id: layerSpec.id,
      order: layerSpec.order,
      hidden: layerSpec.hidden
    });

    this.layersLoading[layer.id] = true;

    const layerTpl = {
      version: '1.3.0',
      stat_tag: 'API',
      layers: layer.body.layers
    };
    const params = `?stat_tag=API&config=${encodeURIComponent(JSON.stringify(layerTpl))}`;

    fetch(`https://${layer.account}.carto.com/api/v1/map${params}`)
      .then(response => (
        response.json()
      ))
      .then((data) => {
        // const tileUrl = `https://${layer.account}.carto.com/api/v1/map/${data.layergroupid}/{z}/{x}/{y}.png`;
        const tileUrl = `${data.cdn_url.templates.https.url}/${layer.account}/api/v1/map/${data.layergroupid}/{z}/{x}/{y}.png`;

        this.mapLayers[layer.id] = L.tileLayer(tileUrl).addTo(this.map);

        this.mapLayers[layer.id].setZIndex(layer.hidden ? -1 : layer.order);

        this.mapLayers[layer.id].on('load', () => {
          delete this.layersLoading[layer.id];
        });
        this.mapLayers[layer.id].on('tileerror', () => {
          this.rejectLayersLoading = true;
        });
      })
      .then(() => {
        this.rejectLayersLoading = true;
      });
  }

  setZIndex(layers) {
    const layerIds = Object.keys(this.mapLayers);
    layerIds.forEach((layerId) => {
      const order = layers.find(l => l.id === layerId).order;
      this.mapLayers[layerId].setZIndex(order);
    });
  }
}
