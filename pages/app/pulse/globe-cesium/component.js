import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import compact from 'lodash/compact';

// Redux
import { connect } from 'react-redux';

// Components

let Cesium;

// -----------------GLOBE CONSTANTS-------------------
/* Zoom defaults */
const MAXIMUM_ZOOM_DISTANCE = 30000000;
const MINIMUM_ZOOM_DISTANCE = 99;
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
  constructor(props) {
    super(props);

    this.state = {
      billboardHover: false
    };

    // Bindings
    this.onMouseClick = this.onMouseClick.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
  }

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
      skyAtmosphere: false,
      ...this.props.viewerOptions
    });

    // Set maximum/minimum zoom values
    this.viewer.scene.screenSpaceCameraController.maximumZoomDistance = MAXIMUM_ZOOM_DISTANCE;
    this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = MINIMUM_ZOOM_DISTANCE;
    this.viewer.scene.globe.baseColor = Cesium.Color.BLACK;

    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.handler.setInputAction(
      this.onMouseClick,
      Cesium.ScreenSpaceEventType.LEFT_CLICK,
    );
    this.handler.setInputAction(
      this.onMouseDown,
      Cesium.ScreenSpaceEventType.LEFT_DOWN,
    );
    this.handler.setInputAction(
      this.onMouseMove,
      Cesium.ScreenSpaceEventType.MOUSE_MOVE,
    );

    this.viewer.camera.moveStart.addEventListener(() => {
      if (this.props.onMoveStart) {
        this.props.onMoveStart();
      }
    });
    this.viewer.camera.moveEnd.addEventListener(() => {
      if (this.props.onMoveEnd) {
        this.props.onMoveEnd();
      }
    });

    this.imageryLayers = this.viewer.imageryLayers;

    this.viewModel = {
      layers: [],
      contextLayers: [],
      upLayer: null,
      downLayer: null,
      selectedLayer: null,
      raise(layer, index) {
        this.imageryLayers.raise(layer);
        this.viewModel.upLayer = layer;
        this.viewModel.downLayer = this.viewModel.layers[Math.max(0, index - 1)];
        this.updateLayers();
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
        this.updateLayers();
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

    this.contextLayers = this.viewModel.contextLayers;

    Cesium.knockout.track(this.viewModel);

    this.initGlobe();

    // ----- Markers ---------
    if (this.props.markers) {
      this.createShapes(this.props.markers);
    }
  }

  componentWillReceiveProps(nextProps) {
    const mainLayer = this.props.layerActive && this.props.layerActive.url;
    const newMainLayer = nextProps.layerActive && nextProps.layerActive.url;

    // ----- Updates in layers ----------
    if (nextProps.basemap !== this.props.basemap ||
      nextProps.activeContextLayers !== this.props.activeContextLayers ||
      newMainLayer !== mainLayer) {
      this.updateLayers(
        nextProps,
        nextProps.basemap !== this.props.basemap,
        (nextProps.activeContextLayers !== this.props.activeContextLayers) ||
        (newMainLayer !== mainLayer)
      );
    }
    // ----- Markers ---------
    if (nextProps.markers !== this.props.markers) {
      this.removeShapes();
      this.createShapes(nextProps.markers);
    }
    // ----- 3D layer points ------
    if (nextProps.layerPoints !== this.props.layerPoints) {
      this.removeShapes();
      if (nextProps.layerPoints.length > 0) {
        this.props.setShapesCreated(false);
        this.createShapes(this.getShapes(nextProps));
      }
    }
    // -------- zoom level updates -------------
    if (this.props.zoom !== nextProps.zoom) {
      const { camera } = this.viewer;
      const increment = this.props.zoom - nextProps.zoom;
      const difference = camera.getMagnitude() - this.viewer.scene.globe.ellipsoid.maximumRadius;
      const smallerScalar = difference < 1000000;
      let scalar = smallerScalar ? 0.95 : 0.9;
      if (increment < 0) {
        scalar = smallerScalar ? 1.005 : 1.1;
      }
      const newPosition = {
        x: camera.position.x * scalar,
        y: camera.position.y * scalar,
        z: camera.position.z * scalar
      };
      this.viewer.camera.flyTo({ destination: newPosition, duration: 1.5 });
    }
  }

  onMouseClick(click) {
    if (this.props.onClick) {
      this.props.onClick({ clickedPosition: click.position, viewer: this.viewer });
    }

    const pickedFeature = this.viewer.scene.pick(click.position);
    if (pickedFeature && pickedFeature.id.type === 'billboard' && this.props.onBillboardClick) {
      pickedFeature.id.highlighted = true;
      pickedFeature.id.billboard.image = pickedFeature.id.imageSelected;
      // Dehighlight the rest of billboards
      this.viewer.entities.values.forEach((entity) => {
        if (entity.type === 'billboard' && entity.id !== pickedFeature.id.id) {
          entity.highlighted = false;
          entity.billboard.image = entity.imageNotSelected;
        }
      });
      this.props.onBillboardClick(pickedFeature);
    }
  }

  onMouseDown(click) {
    if (this.props.onMouseDown) {
      this.props.onMouseDown({
        clickedPosition: click.position,
        viewer: this.viewer
      });
    }
  }

  onMouseMove(mouse) {
    const { billboardHover } = this.state;

    if (this.props.onMouseMove) {
      this.props.onMouseMove({
        hoverPosition: mouse.startPosition,
        endPosition: mouse.endPosition,
        viewer: this.viewer
      });
    }
    const pickedFeature = this.viewer.scene.pick(mouse.endPosition);

    if (Cesium.defined(pickedFeature) && pickedFeature.id.type === 'billboard'
      && this.props.onBillboardHover && !billboardHover) {
      this.setState({ billboardHover: true });
      this.props.onBillboardHover(pickedFeature);
    } else if (!Cesium.defined(pickedFeature) && billboardHover) {
      if (this.props.onBillboardOut) {
        this.props.onBillboardOut();
      }
      this.setState({ billboardHover: false });
    }
  }

  getShapes(props) {
    const { layerActive, layerPoints } = props;
    const { markerType } = layerActive;
    let shapes = [];
    if (layerPoints) {
      shapes = compact(layerPoints.map((elem) => {
        if (!layerActive.attributes.interactionConfig) {
          return null;
        }

        const tooltipContentObj = layerActive.attributes.interactionConfig.output.map(obj =>
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

  addAdditionalLayerOption(name, imageryProvider, alpha, show) {
    const layer = this.imageryLayers.addImageryProvider(imageryProvider);
    layer.alpha = Cesium.defaultValue(alpha, 0.5);
    layer.show = Cesium.defaultValue(show, true);
    layer.name = name;
    Cesium.knockout.track(layer, ['alpha', 'show', 'name']);
  }

  addBasemap(name, imageryProvider, alpha, show) {
    const layer = this.imageryLayers.addImageryProvider(imageryProvider, 0);
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

  removeContextLayers() {
    for (let i = 1; i < this.imageryLayers.length; i++) {
      if (this.imageryLayers.get(i).name !== 'mainLayer') {
        this.imageryLayers.remove(this.imageryLayers.get(i), false);
      }
    }
  }

  removeBasemap() {
    this.imageryLayers.remove(this.imageryLayers.get(0), false);
  }

  updateLayers(
    props,
    updateBasemap = true,
    updateLayers = true
  ) {
    const {
      basemap,
      activeContextLayers,
      contextLayersOnTop,
      layerActive
    } = props;
    const mainLayer = layerActive && layerActive.url;

    if (basemap && updateBasemap) {
      this.removeBasemap();
      this.addBasemap(
        basemap.name,
        new Cesium.UrlTemplateImageryProvider({ url: basemap.url }), 1, true
      );
    }

    if (!contextLayersOnTop && updateLayers) {
      this.removeContextLayers();
      activeContextLayers.forEach(l => this.addAdditionalLayerOption(
        l.id,
        new Cesium.UrlTemplateImageryProvider({ url: l.url }), 1, true
      ));
    }

    if (mainLayer && updateLayers) {
      this.removeMainLayer();
      this.addAdditionalLayerOption('mainLayer', new Cesium.UrlTemplateImageryProvider({ url: mainLayer }), 1, true);
    }

    if (contextLayersOnTop && updateLayers) {
      this.removeContextLayers();
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

  initGlobe() {
    this.addAdditionalLayerOption(
      'default',
      new Cesium.BingMapsImageryProvider({
        url: 'https://dev.virtualearth.net',
        key: Cesium.BingMapsApi.defaultKey,
        mapStyle: Cesium.BingMapsStyle.AERIAL
      })
    );
  }

  createShapes(shapes) {
    if (shapes) {
      shapes.forEach((shape) => {
        if (shape.type === 'billboard') {
          const position = Cesium.Cartesian3.fromDegrees(shape.lon, shape.lat);
          this.viewer.entities.add({
            position,
            billboard: {
              image: shape.image
            },
            name: shape.name,
            type: 'billboard',
            imageSelected: shape.imageSelected,
            imageNotSelected: shape.imageNotSelected
          });
        } else if (shape.type === 'cylinder') {
          const position = Cesium.Cartesian3.fromDegrees(shape.lon, shape.lat, shape.height * 0.5);
          this.viewer.entities.add({
            position,
            cylinder: {
              length: shape.height,
              topRadius: shape.topRadius,
              bottomRadius: shape.bottomRadius,
              outlineWidth: 4,
              material: shape.color,
              minimumPixelSize: 128,
              maximumScale: 20000
            },
            description: shape.description,
            name: shape.name,
            type: 'cylinder'
          });
        }
      });

      setTimeout(() => this.props.setShapesCreated(true), shapes.length * 2);
    }
  }

  removeShapes() {
    this.viewer.entities.removeAll();
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
  layerPoints: PropTypes.array,
  layerActive: PropTypes.object,
  zoom: PropTypes.number,
  markers: PropTypes.array,
  viewerOptions: PropTypes.object,

  // Store
  setShapesCreated: PropTypes.func.isRequired,

  // Callbacks
  onClick: PropTypes.func,
  onBillboardClick: PropTypes.func,
  onMoveEnd: PropTypes.func,
  onMoveStart: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseDown: PropTypes.func,
  onBillboardOut: PropTypes.func,
  onBillboardHover: PropTypes.func
};

export default connect(null, null)(GlobeCesiumComponent);
