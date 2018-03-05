import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import compact from 'lodash/compact';

// Redux
import { connect } from 'react-redux';

// Components

let Cesium;

//----------------------------------------------------------
// TO-DO move this to somewhere else that makes more sense
/* Severity colors */
const severityLowColor = '#2C7FB8';
const severityMediumColor = '#7FCDBB';
const severityHighColor = '#EDF8B1';
/* Magnitude colors */
const magnitudeLessThan5Color = '#feebe2';
const magnitude5_5_5Color = '#fbb4b9'; // eslint-disable-line camelcase
const magnitude5_5_6Color = '#f768a1'; // eslint-disable-line camelcase
const magnitude6_7Color = '#c51b8a'; // eslint-disable-line camelcase
const magnitude7orMore = '#7a0177';
/* Url tone colors */
const tone_10_7Color = '#d7301f'; // eslint-disable-line camelcase
const tone_7_5Color = '#fc8d59'; // eslint-disable-line camelcase
const tone_5_2Color = '#fdcc8a'; // eslint-disable-line camelcase
const tone_2orMoreColor = '#fef0d9'; // eslint-disable-line camelcase
//----------------------------------------------------------

class GlobeCesiumComponent extends PureComponent {
  componentDidMount() {
    // Init Cesium var
    Cesium = window.Cesium; // eslint-disable-line prefer-destructuring
    Cesium.BingMapsApi.defaultKey = process.env.BING_MAPS_API_KEY;

    // Create viewer object
    this.viewer = new Cesium.Viewer('cesiumContainer', {
      geocoder: false,
      homeButton: false,
      selectionIndicato: false,
      sceneModePicker: false,
      baseLayerPicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      creditsDisplay: false,
      fullscreenButton: false,
      skyAtmosphere: false
    });

    this.imageryLayers = this.viewer.imageryLayers;

    this.viewModel = {
      layers: [],
      baseLayers: [],
      contextLayers: [],
      upLayer: null,
      downLayer: null,
      selectedLayer: null,
      isSelectableLayer(layer) {
        return this.baseLayers.indexOf(layer) >= 0;
      },
      raise(layer, index) {
        this.imageryLayers.raise(layer);
        this.viewModel.upLayer = layer;
        this.viewModel.downLayer = this.viewModel.layers[Math.max(0, index - 1)];
        this.updateLayerList();
        window.setTimeout(() => {
          this.viewModel.upLayer = null;
          this.viewModel.downLayer = null;
        }, 10);
      },
      lower(layer, index) {
        this.imageryLayers.lower(layer);
        this.viewModel.upLayer =
          this.viewModel.layers[Math.min(this.viewModel.layers.length - 1, index + 1)];
        this.viewModel.downLayer = layer;
        this.updateLayerList();
        window.setTimeout(() => {
          this.viewModel.upLayer = null;
          this.viewModel.downLayer = null;
        }, 10);
      },
      canRaise(layerIndex) {
        return layerIndex > 0;
      },
      canLower(layerIndex) {
        return layerIndex >= 0 && layerIndex < this.imageryLayers.length - 1;
      }
    };

    this.baseLayers = this.viewModel.baseLayers;
    this.contextLayers = this.viewModel.contextLayers;

    Cesium.knockout.track(this.viewModel);

    this.setupLayers();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.basemap !== this.props.basemap ||
      nextProps.activeContextLayers !== this.props.activeContextLayers ||
      nextProps.mainLayer !== this.props.mainLayer) {
      this.updateLayers(nextProps);
    }
  }

  setupLayers() {
    // Create all the base layers that this example will support.
    // These base layers aren't really special.  It's possible to have multiple of them
    // enabled at once, just like the other layers, but it doesn't make much sense because
    // all of these layers cover the entire globe and are opaque.
    this.addBaseLayerOption(
      'default',
      new Cesium.BingMapsImageryProvider({
        url: 'https://dev.virtualearth.net',
        key: Cesium.BingMapsApi.defaultKey,
        mapStyle: Cesium.BingMapsStyle.AERIAL
      })
    );
  }

  addBaseLayerOption(name, imageryProvider) {
    let layer;
    if (typeof imageryProvider === 'undefined') {
      layer = this.imageryLayers.get(0);
      this.viewModel.selectedLayer = layer;
    } else {
      layer = new Cesium.ImageryLayer(imageryProvider);
    }

    layer.name = name;
    this.baseLayers.push(layer);
    return layer;
  }

  addAdditionalLayerOption(name, imageryProvider, alpha, show) {
    const layer = this.imageryLayers.addImageryProvider(imageryProvider);
    layer.alpha = Cesium.defaultValue(alpha, 0.5);
    layer.show = Cesium.defaultValue(show, true);
    layer.name = name;
    Cesium.knockout.track(layer, ['alpha', 'show', 'name']);
  }

  removeMainLayer() {
    for (let i = 0; i < this.imageryLayers.length; i++) {
      if (this.imageryLayers.get(i).name === 'mainLayer') {
        this.imageryLayers.remove(this.imageryLayers.get(i), false);
      }
    }
  }

  updateLayers(props) {
    const {
      basemap,
      activeContextLayers,
      mainLayer,
      contextLayersOnTop
    } = props;

    if (basemap) {
      const basemapFound = this.baseLayers.find(l => l.name === basemap.name);
      // Check if the basemap provided has already been added
      if (!basemapFound) {
        const newBasemap = this.addBaseLayerOption(
          basemap.name,
          new Cesium.UrlTemplateImageryProvider({ url: basemap.url })
        );
        this.imageryLayers.add(newBasemap, 0);
        this.imageryLayers.remove(this.viewModel.layers[0], false);
      } else {
        this.imageryLayers.add(basemapFound);
      }
    }

    if (!contextLayersOnTop) {
      activeContextLayers.forEach(l => this.addAdditionalLayerOption(
        l.id,
        new Cesium.UrlTemplateImageryProvider({ url: l.url }), 1, true
      ));
    }

    if (mainLayer) {
      // Remove previous mainLayer
      this.removeMainLayer();

      this.addAdditionalLayerOption('mainLayer', new Cesium.UrlTemplateImageryProvider({ url: mainLayer }), 1, true);
    }

    if (contextLayersOnTop) {
      activeContextLayers.forEach(l => this.addAdditionalLayerOption(
        l.id,
        new Cesium.UrlTemplateImageryProvider({ url: l.url }), 1, true
      ));
    }

    const numContextLayers = this.imageryLayers.length;
    this.viewModel.layers.splice(0, this.viewModel.layers.length);
    for (let i = numContextLayers - 1; i >= 0; --i) {
      this.viewModel.layers.push(this.imageryLayers.get(i));
    }
  }

  getShapes(layerPoints, markerType) {
    let shapes = [];
    if (layerPoints) {
      shapes = compact(layerPoints.map((elem) => {
        if (!this.state.interactionConfig) {
          return null;
        }

        const tooltipContentObj = this.state.interactionConfig.output.map(obj =>
          ({ key: obj.property, value: elem[obj.column], type: obj.type }));
        const description = tooltipContentObj.map((val) => {
          if (val.type === 'url') {
            return `<strong>${val.key}</strong>: <a href=${val.value} target="_blank">${val.value}</a>`;
          } else { // eslint-disable-line no-else-return
            return `<strong>${val.key}</strong>: ${val.value}`;
          }
        });

        // ---- HEIGHT ------
        const defaultHeight = 10000;
        let height = defaultHeight;
        if (elem.mag) {
          height = elem.mag * 100000;
        } else if (elem.displaced) {
          height = (elem.displaced > 0) ? Math.log(elem.displaced) * 100000 : defaultHeight;
        } else if (markerType === 'volcano') {
          height = 50000;
        } else if (elem.distance_km) {
          height = (elem.distance_km > 0) ? Math.log(elem.distance_km) * 30000 : defaultHeight;
        } else if (elem.fatalities) {
          height = (elem.fatalities > 0) ? elem.fatalities * 100000 : defaultHeight;
        }

        // ------------------- COLOR --------------------------
        let color = Cesium.Color.WHITE;
        if (markerType === 'volcano') {
          color = Cesium.Color.RED;
        }
        const { severity, urltone, mag } = elem;
        if (severity) {
          if (severity >= 1 && severity < 1.25) {
            color = severityLowColor;
          } else if (severity >= 1.25 && severity < 1.75) {
            color = severityMediumColor;
          } else if (severity >= 1.75 && severity <= 2) {
            color = severityHighColor;
          }
          color = Cesium.Color.fromCssColorString(color);
        }
        if (urltone) {
          if (urltone < -7) {
            color = tone_10_7Color; // eslint-disable-line camelcase
          } else if (urltone >= -7 && urltone < -5) {
            color = tone_7_5Color; // eslint-disable-line camelcase
          } else if (urltone >= -5 && urltone < -2) {
            color = tone_5_2Color; // eslint-disable-line camelcase
          } else if (urltone >= -2) {
            color = tone_2orMoreColor; // eslint-disable-line camelcase
          }
          color = Cesium.Color.fromCssColorString(color);
        }
        if (mag) {
          if (mag < 5) {
            color = magnitudeLessThan5Color;
          } else if (mag >= 5 && mag < 5.5) {
            color = magnitude5_5_5Color; // eslint-disable-line camelcase
          } else if (mag >= 5.5 && mag < 6) {
            color = magnitude5_5_6Color; // eslint-disable-line camelcase
          } else if (mag >= 6 && mag < 7) {
            color = magnitude6_7Color; // eslint-disable-line camelcase
          } else if (mag >= 7) {
            color = magnitude7orMore; // eslint-disable-line camelcase
          }
          color = Cesium.Color.fromCssColorString(color);
        }
        //-----------------------------------------

        // -------------SHAPE--------------
        let bottomRadius = 15000;
        let topRadius = 15000;

        if (markerType === 'volcano') {
          bottomRadius = 50000;
        }
        if (+elem.displaced || elem.displaced === 0) {
          topRadius = 30000;
          bottomRadius = 30000;
        }
        //--------------------------------

        return {
          description: description.join('<br>'),
          height,
          lat: elem.lat,
          lon: elem.lon,
          name: elem.name || elem.title || '',
          topRadius,
          bottomRadius,
          color,
          type: 'cylinder'
        };
      }));
    }
    return shapes;
  }

  render() {
    return (
      <div id="cesiumContainer" className="c-globe-cesium" />
    );
  }
}


GlobeCesiumComponent.propTypes = {
  basemap: PropTypes.object,
  activeContextLayers: PropTypes.array,
  contextLayersOnTop: PropTypes.bool,
  mainLayer: PropTypes.object
};

export default connect(null, null)(GlobeCesiumComponent);
