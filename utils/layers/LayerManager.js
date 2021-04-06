/* eslint global-require: 0 */
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';

if (typeof window !== 'undefined') {
  // adding support for UTFGrid
  require('leaflet-utfgrid/L.UTFGrid-min');

  // adding support for Side by Side
  require('lib/leaflet-side-by-side');
}

export default class LayerManager {
  // Constructor
  constructor(map, options = {}) {
    this.map = map;
    this.options = options;
    this.mapLayers = {};
    this.interactionLayers = {};
    this.layersLoading = {};
    this.rejectLayersLoading = false;
    this.onLayerAddedSuccess = options.onLayerAddedSuccess;
    this.onLayerAddedError = options.onLayerAddedError;
    this.onLayerClick = options.onLayerClick;
    this.layersUpdated = options.layersUpdated || null;
    this.errors = false;
    this.errorDetails = null;

    if (options.swipe) {
      this.sideBySideControl = L.control.sideBySide();
      this.sideBySideControl.addTo(this.map);
    }
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
      geojson: this.addGeoJsonLayer,
      // GEE
      gee: this.addGeeLayer,
      nexgddp: this.addNexGDDPLayer,
    }[layer.provider];

    if (method) method.call(this, layer, { ...opts });

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
    // Remove layer
    if (this.mapLayers[layerId]) {
      this.map.removeLayer(this.mapLayers[layerId]);
      delete this.mapLayers[layerId];
    }

    // Remove interaction layer
    if (this.interactionLayers[layerId]) {
      this.map.removeLayer(this.interactionLayers[layerId]);
      delete this.interactionLayers[layerId];
    }
  }

  removeLayers() {
    Object.keys(this.mapLayers).forEach((id) => {
      this.removeLayer(id);
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

  swipeLayer(layer, sideBySide) {
    if (layer) {
      requestAnimationFrame(() => {
        switch (sideBySide) {
          case 'left':
            this.sideBySideControl.setLeftLayers(layer);
            break;
          case 'right':
            this.sideBySideControl.setRightLayers(layer);
            break;
          default:
            this.sideBySideControl.setLeftLayers(layer);
        }

        this.map.invalidateSize();
      });
    }
  }

  addNexGDDPLayer(layer) {
    const tileUrl = `${process.env.NEXT_PUBLIC_WRI_API_URL}/v1/layer/${layer.id}/tile/nexgddp/{z}/{x}/{y}`;
    const tileLayer = L.tileLayer(tileUrl).addTo(this.map);
    this.mapLayers[layer.id] = tileLayer;

    if (this.options.swipe) {
      this.swipeLayer(this.mapLayers[layer.id], layer.sideBySide);
    }
  }

  addGeeLayer(layer) {
    const tileUrl = `${process.env.NEXT_PUBLIC_WRI_API_URL}/v1/layer/${layer.id}/tile/gee/{z}/{x}/{y}`;
    const tileLayer = L.tileLayer(tileUrl).addTo(this.map);
    this.mapLayers[layer.id] = tileLayer;

    if (this.options.swipe) {
      this.swipeLayer(this.mapLayers[layer.id], layer.sideBySide);
    }
  }

  addGeoJsonLayer(layer) {
    const geojsonLayer = L.geoJSON(layer.layerConfig.data).addTo(this.map);
    this.mapLayers[layer.id] = geojsonLayer;

    if (layer.layerConfig.fitBounds) {
      const bounds = geojsonLayer.getBounds();

      this.map.fitBounds([
        bounds.getNorthWest(),
        bounds.getSouthEast(),
      ], { padding: [20, 20] });
    }

    if (this.options.swipe) {
      this.swipeLayer(this.mapLayers[layer.id], layer.sideBySide);
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
        layer = L.tileLayer.wms(layerData.url, layerData.body); // eslint-disable-line
        break;
      case 'tileLayer':
        if (layerData.body.style
            && typeof layerData.body.style === 'string'
            && layerData.body.indexOf('style: "function') >= 0) {
          layerData.body.style = eval(`(${layerData.body.style})`); // eslint-disable-line
        }
        layer = L.tileLayer(layerData.url, layerData.body); // eslint-disable-line
        break;
      default:
        layer = L[layerData.type](layerData.body, layerData.options || {});
        delete this.layersLoading[layerData.id];
        break;
    }

    if (layer) {
      const eventName = (layerData.type === 'wms'
      || layerData.type === 'tileLayer') ? 'tileload' : 'load';
      layer.on(eventName, () => {
        delete this.layersLoading[layerData.id];
      });
      if (zIndex) {
        layer.setZIndex(zIndex);
      }
      layer.addTo(this.map);
      this.mapLayers[layerData.id] = layer;

      if (this.options.swipe) {
        this.swipeLayer(this.mapLayers[layerSpec.id], layerSpec.sideBySide);
      }
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
      if (layerData.body.style
          && typeof layerData.body.style === 'string'
          && layerData.body.indexOf('style: "function') >= 0) {
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
      if (layerConfig.style
        && layerConfig.style.indexOf('function') >= 0) {
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

        if (this.options.swipe) {
          if (!this.mapLayers[layerSpec.id].getContainer) {
            this.mapLayers[layerSpec.id].getContainer = () => layerElement;
          }
          this.swipeLayer(this.mapLayers[layerSpec.id], layerSpec.sideBySide);
        }
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

  verifyCartoLayer(layerSpec, callback) {
    return this.addCartoLayer(layerSpec, true, callback);
  }

  addCartoLayer(layerSpec, verifyLayersOnly = false, callback) {
    const layer = {
      ...layerSpec.layerConfig,
      id: layerSpec.id,
      name: layerSpec.name,
      order: layerSpec.order,
      opacity: layerSpec.opacity,
      hidden: layerSpec.hidden,
      sideBySide: layerSpec.sideBySide,
    };

    this.layersLoading[layer.id] = true;

    // is it interactive?
    const isInteractive = !isEmpty(layerSpec.interactionConfig)
                          && !!layerSpec.interactionConfig.output
                          && !!layerSpec.interactionConfig.output.length;

    const layerTpl = {
      version: '1.3.0',
      stat_tag: 'API',
      layers: layer.body.layers.map((l) => {
        if (isInteractive) {
          return {
            ...l,
            options: {
              ...l.options,
              interactivity: layerSpec.interactionConfig.output.map((o) => o.column),
            },
          };
        }
        return l;
      }),
    };
    const params = `?stat_tag=API&config=${encodeURIComponent(JSON.stringify(layerTpl))}`;

    axios.get(`https://${layer.account}.carto.com/api/v1/map${params}`)
      .then((response) => {
        if (response.status >= 400) this.errors = true;

        if (this.errors) this.rejectLayersLoading = true;
        return response.data;
      })
      .then((data) => {
        if (verifyLayersOnly === true) {
          if (this.layersUpdated && typeof this.layersUpdated === 'function') this.layersUpdated(!this.errors, data);
          if (this.errors) this.errorDetails = data;
          if (callback && typeof callback === 'function') callback(!this.errors);
          return;
        }

        const tileUrl = `${data.cdn_url.templates.https.url}/${layer.account}/api/v1/map/${data.layergroupid}/{z}/{x}/{y}.png`;

        this.mapLayers[layer.id] = L.tileLayer(tileUrl).addTo(this.map);

        this.mapLayers[layer.id].setOpacity(layer.opacity !== undefined ? layer.opacity : 1);

        this.mapLayers[layer.id].on('load', () => {
          delete this.layersLoading[layer.id];
        });

        this.mapLayers[layer.id].on('tileerror', () => {
          this.rejectLayersLoading = true;
        });

        if (this.options.swipe) {
          this.swipeLayer(this.mapLayers[layer.id], layer.sideBySide);
        }

        // Add interactivity
        if (isInteractive) {
          const gridUrl = `https://${layer.account}.carto.com/api/v1/map/${data.layergroupid}/0/{z}/{x}/{y}.grid.json`;
          this.interactionLayers[layer.id] = L.utfGrid(gridUrl).addTo(this.map).setZIndex(995);

          this.interactionLayers[layer.id].on('click', (e) => {
            this.onLayerClick({ ...e, ...layer, ...layerSpec });
          });
        }

        if (callback && typeof callback === 'function') callback(!this.errors);
      }).catch(() => {
        this.rejectLayersLoading = true;
      });
  }

  setZIndex(layers) {
    const layerIds = Object.keys(this.mapLayers);
    layerIds.forEach((layerId) => {
      const order = layers.findIndex((l) => l.id === layerId);
      this.mapLayers[layerId].setZIndex(100 - order);
    });
  }

  setOpacity(layers) {
    const layerIds = Object.keys(this.mapLayers);
    layerIds.forEach((layerId) => {
      const layer = layers.find((l) => l.id === layerId);
      if (!layer) return;
      let opacity = layer.opacity !== undefined ? layer.opacity : 1;
      opacity = layer.visible === false ? 0 : opacity;
      if (layerId in this.mapLayers && 'setOpacity' in this.mapLayers[layerId]) {
        this.mapLayers[layerId].setOpacity(opacity);
      }
    });
  }

  setVisibility(layers) {
    const layerIds = Object.keys(this.mapLayers);
    layerIds.forEach((layerId) => {
      const layer = layers.find((l) => l.id === layerId);
      if (!layer) return;
      let opacity = layer.opacity !== undefined ? layer.opacity : 1;
      opacity = layer.visible === false ? 0 : opacity;
      if (layerId in this.mapLayers && 'setOpacity' in this.mapLayers[layerId]) {
        this.mapLayers[layerId].setOpacity(opacity);
      }
    });
  }
}
