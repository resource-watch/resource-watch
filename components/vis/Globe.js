import React from 'react';
import debounce from 'lodash/debounce';
import { TextureLoader, Raycaster, Vector2, CylinderGeometry,
  SphereGeometry, MeshBasicMaterial, Matrix4, Mesh,
  ShaderMaterial, BackSide, Scene, PerspectiveCamera, WebGLRenderer,
  MeshPhongMaterial, AdditiveBlending, Vector3,
  AmbientLight, PointLight } from 'three';
import orbitControls from './OrbitControls';
import chroma from 'chroma-js';

/* global Stats */
const OrbitControls = orbitControls();
const imageLoader = new TextureLoader();

class Globe extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      texture: props.texture,
      height: props.height,
      width: props.width,
      markers: [],
      selectedMarker: null
    };

    this.raycaster = new Raycaster(); // create once
    this.mouse = new Vector2();

    this.redGreenScale = chroma.scale(['red', 'lightgreen']).domain([-10, 10]);

    // Bindings
    this.onClick = this.onClick.bind(this);
    this.onResize = debounce(this.onResize.bind(this), 250);

    // document.addEventListener('mousedown', this.onMouseDown);
  }

  componentDidMount() {
    const { useHalo, useDefaultLayer } = this.props;

    this.createScene();
    this.createEarth();
    if (useHalo) {
      this.addHalo();
    }
    if (useDefaultLayer) {
      this.setTexture();
    }
    this.addLights();
    this.addControls();

    // Start!
    this.draw();

    window.addEventListener('resize', this.onResize);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.texture !== this.props.texture) {
      this.setState({ texture: nextProps.texture || null });
    }
    if (nextProps.width !== this.props.width) {
      this.setState({ width: nextProps.width });
    }
    if (nextProps.height !== this.props.height) {
      this.setState({ height: nextProps.height });
    }
    if (nextProps.layerPoints !== this.props.layerPoints) {
      this.slideToRight();
    }
    if (nextProps.layerPoints.length > 0) {
      if (this.currentTexture != null) {
        this.removeTexture();
      }
      if (this.state.markers.length > 0) {
        this.removeMarkers();
      }
      const { markerType } = nextProps;
      const pointObjects = nextProps.layerPoints.map((value) => {
        const normalVector = this.convertLatLonToCoordinates(value.lat, value.lon);
        const geometryColor = this.getMarkerColor(value);
        const height = this.getMarkerHeight(value);

        let geometry;

        switch (markerType) {
          case 'bar':
            geometry = new CylinderGeometry(0.3, 0.3, height);
            break;
          case 'volcano':
            geometry = new CylinderGeometry(0.3, 1.3, height);
            break;
          case 'hemisphere':
            geometry = new SphereGeometry(0.5, 8, 8);
            break;
          default:
            geometry = new CylinderGeometry(0.3, 0.3, height);
        }

        // Translate the geometry so the base sits at the origin.
        geometry.applyMatrix(new Matrix4().makeTranslation(0, 0, 0));

        // Rotate the geometry so the top points in the direction of the positive-Z axis.
        geometry.applyMatrix(new Matrix4().makeRotationX(Math.PI / 2));

        // Create the mesh.
        const material = new MeshPhongMaterial({ color: geometryColor });
        const obj = new Mesh(geometry, material);
        obj.lookAt(normalVector);
        obj.position.copy(normalVector);
        obj.name = value;

        this.scene.add(obj);

        return obj;
      });
      this.setState({ markers: pointObjects });
    } else if (this.props.layerPoints.length > 0) {
      this.removeMarkers();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.texture !== this.state.texture) {
      if (prevState.texture === null && this.state.texture !== null) {
        this.setTexture();
      }
      this.slideToRight();
    }
    if ((prevState.width !== this.state.width) ||
      (prevState.height !== this.state.height)) {
      this.update();
    }
    if (this.state.selectedMarker) {
      this.state.selectedMarker.object.material = new MeshPhongMaterial(
        { color: this.props.markerSelectedColor });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  getMarkerHeight(value) {
    let data = value;
    if (value.object) {
      data = value.object.name;
    }
    let height = 1;
    const distance = data.distance_km;
    const displaced = data.displaced;
    const mag = data.mag;
    const fatalities = data.fatalities;

    if (displaced) {
      if (displaced > 0) {
        height = Math.log(displaced);
      } else {
        height = 0;
      }
    }
    if (distance) {
      if (distance > 0) {
        height = Math.log(distance) * 3;
      } else {
        height = 0;
      }
    }
    if (mag) {
      height = mag;
    }
    if (fatalities) {
      height = fatalities;
    }

    return height;
  }

  getMarkerColor(value) {
    let data = value;
    if (value.object) {
      data = value.object.name;
    }
    const severity = data.severity;
    const urlTone = data.urltone;
    let color = this.props.markerDefaultColor;

    if (severity) {
      switch (severity) {
        case 1:
          color = this.props.markerMediumColor;
          break;
        case 2:
          color = this.props.markerHighColor;
          break;
        case 3:
          color = this.props.markerHighColor;
          break;
        default:
          color = this.props.markerLowColor;
      }
    }

    if (urlTone) {
      color = this.redGreenScale(urlTone).hex();
    }
    return color;
  }


  onResize() {
    const nextWidth = this.el.clientWidth || this.el.innerWidth;
    const nextHeight = this.el.clientHeight || this.el.innerHeight;
    this.setState({ width: nextWidth, height: nextHeight });
  }

  /**
   * Method to change layers to earth
   */
  setTexture() {
    const mapImage = this.state.texture ?
       imageLoader.load(this.state.texture) : imageLoader.load(this.props.defaultLayerImagePath);
    const { radius, segments, rings, textureExtraRadiusPercentage } = this.props;
    const newRadius = radius + ((radius * textureExtraRadiusPercentage) / 100);
    if (!this.currentTexture) {
      const geometry = new SphereGeometry(newRadius, segments, rings);
      const material = new MeshBasicMaterial({
        map: mapImage,
        transparent: true
      });
      this.currentTexture = new Mesh(geometry, material);
    } else {
      this.currentTexture.material.map = mapImage;
      this.currentTexture.material.needsUpdate = true;
    }
    this.currentTexture.updateMatrix();
    this.currentTexture.name = 'texture';
    this.scene.add(this.currentTexture);
  }

  removeTexture() {
    if (this.currentTexture) {
      this.scene.remove(this.currentTexture);
      this.currentTexture = null;
      this.setState({ texture: null });
    }
  }

  /**
  * Calculate the halo radius according to the properties involved
  */
  getHaloRadius() {
    const { radius, haloExtraRadiusPercentage } = this.props;
    return radius + ((radius * haloExtraRadiusPercentage) / 100);
  }

  /**
   * Initialize three.js and create scene, camera and renderer.
   * Then append canvas.
   */
  createScene() {
    if (this.scene) {
      throw new Error('Scene has been created before.');
    }

    const { width, height } = this.state;
    const { cameraFov, cameraFar, cameraNear, cameraPositionZ } = this.props;

    this.scene = new Scene();
    this.camera = new PerspectiveCamera(cameraFov, width / height, cameraNear, cameraFar);
    this.renderer = new WebGLRenderer({ alpha: true, antialias: true });

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.scene.add(this.camera);

    this.camera.position.z = cameraPositionZ;

    // Appending canvas
    this.el.appendChild(this.renderer.domElement);

    if (this.props.showStats) {
      this.addStats();
    }
  }

  /**
   * Create and add Earth
   */
  createEarth() {
    if (!this.scene) {
      throw new Error('Scene should be created before.');
    }
    const { radius, segments, rings, earthImagePath, earthBumpImagePath, bumpScale } = this.props;
    const material = new MeshPhongMaterial({
      map: imageLoader.load(earthImagePath),
      bumpMap: imageLoader.load(earthBumpImagePath),
      bumpScale: bumpScale
    });
    const geometry = new SphereGeometry(radius, segments, rings);
    this.earth = new Mesh(geometry, material);
    this.earth.updateMatrix();
    this.earth.name = 'earth';
    this.scene.add(this.earth);
  }

  addHalo() {
    if (!this.scene) {
      throw new Error('Scene and camera should be created before.');
    }

    const vertexShaderString = `
      varying vec3 vNormal;
      void main()
      {
        vNormal = normalize( normalMatrix * normal );
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `;
    const fragmentShaderString = `
      varying vec3 vNormal;
      void main()
      {
        float intensity = pow( 0.7 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 4.0 );
        gl_FragColor = vec4( 0.32, 0.32, 0.9, 0.7 ) * intensity;
      }
    `;
    const material = new ShaderMaterial({
      uniforms: {},
      vertexShader: vertexShaderString,
      fragmentShader: fragmentShaderString,
      side: BackSide,
      blending: AdditiveBlending,
      transparent: true
    });

    const { segments } = this.props;
    const haloRadius = this.getHaloRadius();
    const geometry = new SphereGeometry(haloRadius, segments, segments);
    this.halo = new Mesh(geometry, material);
    this.halo.name = 'halo';

    this.scene.add(this.halo);
  }

  /**
   * Draw globe and start animation
   */
  draw() {
    requestAnimationFrame(this.draw.bind(this));
    if (this.controls) {
      this.controls.update();
    }
    if (this.currentTexture) {
      if (!this.state.texture) {
        this.currentTexture.rotation.y += 0.0002;
      } else if (this.currentTexture.rotation.y !== 0) {
        this.currentTexture.rotation.y = 0;
      }
    }
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Change globe position
   * @param  {Number} offsetX
   * @param  {Number} offsetY
   */
  changePosition(offsetX, offsetY) {
    const width = this.state.width;
    const height = this.state.height;
    const oX = offsetX ? (width * offsetX * -1) / 1000 : 0;
    const oY = offsetY ? (width * offsetY * -1) / 1000 : 0;

    this.camera.setViewOffset(width, height, oX, oY, width, height);
  }

  /**
  * convertLatLonToCoordinates
  */
  convertLatLonToCoordinates(lat, lon) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(this.props.radius * Math.sin(phi) * Math.cos(theta));
    const z = (this.props.radius * Math.sin(phi) * Math.sin(theta));
    const y = (this.props.radius * Math.cos(phi));
    return new Vector3(x, y, z);
  }

  /**
  * convertCoordinatesToLatLon
  */
  convertCoordinatesToLatLon(object) {
    const r = this.props.radius;
    const x = object.point.x;
    const y = object.point.y;
    const z = object.point.z;

    let lat = 90 - (Math.acos(y / r)) * 180 / Math.PI;
    let lon = ((270 + (Math.atan2(x, z)) * 180 / Math.PI) % 360) - 180;

    if (lon < 0) {
      lon += 180;
    } else if (lon > 0) {
      lon -= 180;
    }

    lat = Math.round(lat * 100000) / 100000;
    lon = Math.round(lon * 100000) / 100000;

    return { latitude: lat, longitude: lon };
  }

  removeMarkers() {
    if (this.state.markers) {
      this.state.markers.forEach(element => this.scene.remove(element));
      this.setState({
        markers: []
      });
    }
  }

  /**
   * Add stats
   */
  addStats() {
    const scriptElement = document.createElement('script');
    scriptElement.onload = function onLoad() {
      const stats = new Stats();
      document.body.appendChild(stats.dom);
      requestAnimationFrame(function loop() {
        stats.update();
        requestAnimationFrame(loop);
      });
    };
    scriptElement.src = '//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';
    document.head.appendChild(scriptElement);
    return this;
  }

  addLights() {
    if (!this.scene) {
      throw new Error('Scene and camera should be created before.');
    }

    const { pointLightIntensity, pointLightColor, ambientLightColor,
      pointLightPosition, pointLightX, pointLightY, pointLightZ } = this.props;

    const ambientLight = new AmbientLight(ambientLightColor);
    const pointLight = new PointLight(pointLightColor, pointLightIntensity);

    if (pointLightPosition === 'left') {
      pointLight.position.set(-pointLightX, pointLightY, pointLightZ);
    } else {
      pointLight.position.set(pointLightX, pointLightY, pointLightZ);
    }

    this.scene.add(ambientLight);
    this.camera.add(pointLight);
  }

  addControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    const { enableDamping, dampingFactor, autorotate, enablePan, enableZoom,
      zoomSpeed, rotateSpeed, autoRotateSpeed, maxDistance, minDistance } = this.props;

    // Configuring controls
    controls.minDistance = minDistance;
    controls.maxDistance = maxDistance;
    controls.enableDamping = enableDamping;
    controls.dampingFactor = dampingFactor;
    controls.autoRotate = autorotate;
    controls.enablePan = enablePan;
    controls.enableZoom = enableZoom;
    controls.zoomSpeed = zoomSpeed;
    controls.rotateSpeed = rotateSpeed;
    controls.autoRotateSpeed = autoRotateSpeed;

    this.controls = controls;
  }

  slideToRight() {
    this.changePosition(180, 0);
  }

  /**
   * Reset globe position
   */
  resetPosition() {
    const width = this.state.width;
    const height = this.state.height;

    this.camera.setViewOffset(width, height, 0, 0, width, height);
  }

  update() {
    this.camera.aspect = this.state.width / this.state.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.state.width, this.state.height);
    // TODO: update halo size
    // this.halo.geometry.radius = this.getHaloRadius();
    // console.info('this.halo.geometry.radius', this.halo.geometry.radius);
  }

  onClick(event) {
    event.nativeEvent.stopImmediatePropagation();

    this.mouse.x = (event.nativeEvent.offsetX / this.el.clientWidth ) * 2 - 1;
    this.mouse.y = -(event.nativeEvent.offsetY / this.el.clientHeight ) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // this.scene.add(new ArrowHelper(this.raycaster.ray.direction,
    // this.raycaster.ray.origin, 100, Math.random() * 0xffffff ));

    const oldSelectedMarker = this.state.selectedMarker;
    if (oldSelectedMarker) {
      oldSelectedMarker.object.material = new MeshPhongMaterial(
        { color: this.getMarkerColor(oldSelectedMarker) });
    }

    const intersects = this.raycaster.intersectObjects(this.scene.children);

    if (intersects.length > 0) {
      let markerClicked = false;
      const obj = intersects[0];
      const objName = obj.object.name;

      if (objName !== 'halo' && objName !== 'earth' && objName !== 'texture') {
        this.setState({ selectedMarker: obj });
        this.props.onMarkerSelected(objName, event);
        markerClicked = true;
      }

      if (!markerClicked) {
        this.props.onClickInEmptyRegion();
      }
    } else {
      this.props.onClickInEmptyRegion();
    }
    if (this.props.layerPoints.length === 0) {
      const earthIntersect = this.raycaster.intersectObjects([this.earth]);
      if (earthIntersect.length > 0) {
        const latLon = this.convertCoordinatesToLatLon(earthIntersect[0]);
        this.props.onEarthClicked(latLon, event.clientX, event.clientY);
      }
    }
  }

  render() {
    return (
      <div
        ref={(node) => { this.el = node; }}
        className="c-globe"
        onClick={this.onClick}
      />
    );
  }

}

Globe.defaultProps = {

  // Size
  width: (typeof window === 'undefined') ? 1024 : window.innerWidth,
  height: (typeof window === 'undefined') ? 768 : window.innerHeight,

  // Lights
  ambientLightColor: 0x262626,
  // Point light
  pointLightColor: 0xdddddd,
  pointLightIntensity: 0.885,
  pointLightPosition: 'left',
  pointLightX: 400,
  pointLightY: 350,
  pointLightZ: 250,

  // Controls
  autorotate: false,
  autoRotateSpeed: 2.0, // It depends on autorotate
  rotateSpeed: 0.25,
  enablePan: false,
  enableZoom: false,
  zoomSpeed: 0.25,
  enableDamping: true, // Set true to enable inertia
  dampingFactor: 0.25,
  maxDistance: 124,
  minDistance: 80,
  radius: 50,
  segments: 32,
  rings: 32,
  textureExtraRadiusPercentage: 0.4, /* Resulting from calculating the increment
  taking into account that for a given radius of 50 the new radius should be 50.2 */

  // Earth textures
  earthImagePath: null,
  earthBumpImagePath: null,
  bumpScale: 0.01,
  texture: null,
  // Default layer
  userDefaultLayer: false,
  defaultLayerImagePath: null,

  // Camera
  cameraFov: 75,
  cameraNear: 0.01,
  cameraFar: 1000,
  cameraPositionZ: 124,

  // Halo
  useHalo: true,
  haloExtraRadiusPercentage: 16, /* Resulting from calculating the increment
  taking into account that for a given radius of 50 the new radius should be 58 */

  // Stats
  showStats: false,

  // Markers
  markerLowColor: 0xA6005A,
  markerMediumColor: 0xFC00A6,
  markerHighColor: 0xffb4f0,
  markerDefaultColor: 0xffb4f0,
  markerSelectedColor: 0xFFFFFF,
  markerSelectedSizeFactor: 2,
  markerType: 'default'
};

Globe.propTypes = {

  // Size
  width: React.PropTypes.number,
  height: React.PropTypes.number,

  // Lights
  ambientLightColor: React.PropTypes.number,
  pointLightColor: React.PropTypes.number,
  pointLightIntensity: React.PropTypes.number,
  pointLightPosition: React.PropTypes.string,
  pointLightX: React.PropTypes.number,
  pointLightY: React.PropTypes.number,
  pointLightZ: React.PropTypes.number,

  // Controls

  // Sphere structure
  radius: React.PropTypes.number,
  segments: React.PropTypes.number,
  rings: React.PropTypes.number,
  textureExtraRadiusPercentage: React.PropTypes.number,

  // Rotation
  enableDamping: React.PropTypes.bool,
  autorotate: React.PropTypes.bool,
  autoRotateSpeed: React.PropTypes.number,
  rotateSpeed: React.PropTypes.number,
  dampingFactor: React.PropTypes.number,

  // Zoom + Pan
  enablePan: React.PropTypes.bool,
  enableZoom: React.PropTypes.bool,
  zoomSpeed: React.PropTypes.number,
  maxDistance: React.PropTypes.number,
  minDistance: React.PropTypes.number,

  // Top layer (e.g. clouds)

  // Earth textures
  earthImagePath: React.PropTypes.string,
  earthBumpImagePath: React.PropTypes.string,
  bumpScale: React.PropTypes.number,
  texture: React.PropTypes.string,
  // Default layer
  defaultLayerImagePath: React.PropTypes.string,
  useDefaultLayer: React.PropTypes.bool,
  // Layer points
  layerPoints: React.PropTypes.array,

  // Camera
  cameraFov: React.PropTypes.number,
  cameraNear: React.PropTypes.number,
  cameraFar: React.PropTypes.number,
  cameraPositionZ: React.PropTypes.number,

  // Halo
  useHalo: React.PropTypes.bool,
  haloExtraRadiusPercentage: React.PropTypes.number,

  // Stats
  showStats: React.PropTypes.bool,

  // Functions
  onMarkerSelected: React.PropTypes.func,
  onEarthClicked: React.PropTypes.func,
  onClickInEmptyRegion: React.PropTypes.func,

  // Markers
  markerLowColor: React.PropTypes.number,
  markerMediumColor: React.PropTypes.number,
  markerHighColor: React.PropTypes.number,
  markerSelectedColor: React.PropTypes.number,
  markerDefaultColor: React.PropTypes.number,
  markerSelectedSizeFactor: React.PropTypes.number,
  markerType: React.PropTypes.string
};

export default Globe;
