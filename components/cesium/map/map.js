import { Component, createElement } from 'react';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';

import CesiumMapComponent from './map-component';

const assign = (o, ...rest) => Object.assign(o, {}, ...rest);
const { Cesium } = window;

const mapId = `map-${new Date().getTime()}`;

const bindFlyTo = v => (lat, long, z = 15000.0, rest = {}) =>
  v.camera.flyTo(assign({ destination: { x: lat, y: long, z } }, rest));

const disablePanning = (v) => {
  const { scene } = v;
  scene.screenSpaceCameraController.enableRotate = false;
  scene.screenSpaceCameraController.enableTranslate = false;
  scene.screenSpaceCameraController.enableZoom = false;
  scene.screenSpaceCameraController.enableTilt = false;
  scene.screenSpaceCameraController.enableLook = false;
  return v;
};

class CesiumComponent extends Component {
  constructor(props) {
    super(props);
    this.rotatingEvent = false;
    this.state = {
      layers: {},
      viewer: null,
      clickedPosition: null,
      hoverPosition: { x: 0, y: 0 },
      showInfoWindow: true,
      billboardHover: false
    };
  }

  componentDidMount() {
    const { props } = this;
    this.bindMap(Object.assign(props));
    if (props.zoomLevel) this.handleZoom(props.zoomLevel);
    if (props.shapes) this.createShapes(props.shapes);
  }

  componentWillReceiveProps(props) {
    if (this.props.zoomLevel !== props.zoomLevel) {
      this.handleZoom(props.zoomLevel);
    }
    if (this.props.zoom !== props.zoom) {
      const { viewer } = this.state;
      const { camera } = viewer;
      const increment = this.props.zoom - props.zoom;
      const difference = camera.getMagnitude() - viewer.scene.globe.ellipsoid.maximumRadius;
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
      this.state.viewer.camera.flyTo({ destination: newPosition, duration: 1.5 });
    }
    if (this.props.shapes !== props.shapes) {
      this.createShapes(props.shapes);
    }
  }

  componentDidUpdate() {
    this.state.clickedPosition = null;
  }

  onMouseClick = (click) => {
    const { onClick, onBillboardClick } = this.props;
    const { viewer } = this.state;
    if (onClick && viewer) {
      onClick({ clickedPosition: click.position, viewer });
    }

    const pickedFeature = viewer.scene.pick(click.position);
    if (pickedFeature && pickedFeature.id.type === 'billboard' && onBillboardClick) {
      pickedFeature.id.highlighted = true;
      pickedFeature.id.billboard.image = pickedFeature.id.imageSelected;
      // Dehighlight the rest of billboards
      viewer.entities.values.forEach((entity) => {
        if (entity.type === 'billboard' && entity.id !== pickedFeature.id.id) {
          entity.highlighted = false;
          entity.billboard.image = entity.imageNotSelected;
        }
      });
      onBillboardClick(pickedFeature);
    }
    this.setState({ clickedPosition: click.position });
  }

  onMouseDown = (click) => {
    const { onMouseDown } = this.props;
    const { viewer } = this.state;
    if (onMouseDown && viewer) onMouseDown({ clickedPosition: click.position, viewer });
    this.setState({ clickedPosition: click.position });
  }

  onMouseMove = (mouse) => {
    const { onMouseMove, onBillboardHover, onBillboardOut } = this.props;
    const { viewer, billboardHover } = this.state;

    if (onMouseMove && viewer) {
      onMouseMove({ hoverPosition: mouse.startPosition, endPosition: mouse.endPosition, viewer });
    }
    const pickedFeature = viewer.scene.pick(mouse.endPosition);

    if (Cesium.defined(pickedFeature) && pickedFeature.id.type === 'billboard'
      && onBillboardHover && !billboardHover) {
      this.setState({ billboardHover: true });
      onBillboardHover(pickedFeature);
    } else if (!Cesium.defined(pickedFeature) && billboardHover) {
      if (onBillboardOut) {
        onBillboardOut();
      }
      this.setState({ billboardHover: false });
    }

    this.setState({ hoverPosition: mouse.startPosition });
  }

  mountMap({
    lockNavigation,
    zoomLevel,
    imageryProvider,
    homeButton,
    navigationHelpButton,
    selectionIndicator,
    showInfoWindow
  }) {
    const mapConfig = {
      geocoder: false,
      homeButton,
      selectionIndicator,
      sceneModePicker: false,
      baseLayerPicker: false,
      navigationHelpButton,
      animation: false,
      timeline: false,
      creditsDisplay: false,
      fullscreenButton: false,
      skyAtmosphere: false,
      imageryProvider: imageryProvider || new Cesium.BingMapsImageryProvider({
        url: 'https://dev.virtualearth.net',
        key: Cesium.BingMapsApi.defaultKey,
        mapStyle: Cesium.BingMapsStyle.AERIAL,
      }),
    };

    const viewer = (this.state.viewer || new Cesium.Viewer(mapId, mapConfig));
    this.flyTo = bindFlyTo(viewer);

    if (zoomLevel) this.handleZoom(zoomLevel);
    if (lockNavigation) return disablePanning(viewer);
    this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
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

    viewer.camera.moveStart.addEventListener(() => {
      const { onMoveStart } = this.props;
      if (onMoveStart) {
        onMoveStart();
      }
    });
    viewer.camera.moveEnd.addEventListener(() => {
      const { onMoveEnd } = this.props;
      if (onMoveEnd) {
        onMoveEnd();
      }
    });

    this.state.viewer = viewer;
    this.state.showInfoWindow = showInfoWindow;
    return viewer;
  }

  bindMap(props) {
    const viewer = this.mountMap(props);
    const layers = Object.keys(this.state.layers).length
      ? this.state.layers
      : viewer.imageryLayers;

    if (props.onInit) {
      props.onInit(viewer);
    }

    this.setState({
      layers,
      viewer,
    });
  }

  removeRotation() {
    const { viewer } = this.state;
    viewer.clock.onTick.removeEventListener(this.rotate);
    this.rotatingEvent = false;
  }

  handleZoom(zoom) {
    const { state: { viewer } } = this;
    const [zLevel, opts, cameraProps] = zoom;
    if (zLevel && !isEqual(zoom, this.zLevel)) {
      this.flyTo(...zLevel, opts);
      this.zLevel = zoom;
    }

    if (viewer && cameraProps) {
      Object.keys(cameraProps).map((p) => {
        viewer.camera[p] = cameraProps[p];
      });
    }
  }

  rotate = (clock) => {
    const { startTime, currentTime } = clock;
    const { viewer } = this.state;
    const lastNow = startTime.secondsOfDay;
    const now = currentTime.secondsOfDay;
    const spinRate = 0.8;
    const delta = (now - lastNow) / 1000;
    viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -spinRate * delta);
    clock.startTime.secondsOfDay = now - 1;
  }

  addRotation() {
    const { viewer } = this.state;
    if (this.rotatingEvent) return;
    viewer.clock.onTick.addEventListener(this.rotate);
    this.rotatingEvent = true;
  }

  createShapes(shapes) {
    const { viewer } = this.state;

    if (shapes && viewer) {
      viewer.entities.removeAll();
      shapes.forEach((shape) => {
        if (shape.type === 'billboard') {
          const position = Cesium.Cartesian3.fromDegrees(shape.lon, shape.lat);
          viewer.entities.add({
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
          viewer.entities.add({
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

      if (shapes && shapes.length > 0 && this.props.onShapesCreated) {
        const delay = shapes.length * 2;
        setTimeout(() => this.props.onShapesCreated(), delay);
      }
    }
  }

  render() {
    const { props, state } = this;
    const { rotate } = props;
    const {
      layers, viewer, clickedPosition, hoverPosition,
    } = state;
    if (viewer) this[rotate ? 'addRotation' : 'removeRotation']();

    return createElement(CesiumMapComponent, {
      mapId,
      layers,
      viewer,
      clickedPosition,
      hoverPosition,
      ...props,
    });
  }
}

CesiumComponent.propTypes = {
  zoomLevel: PropTypes.object,
  shapes: PropTypes.array,

  // Callbacks
  onInit: PropTypes.function,
  onShapesCreated: PropTypes.function
};

export default CesiumComponent;
