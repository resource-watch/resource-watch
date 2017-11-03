import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Autobind } from 'es-decorators';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { getLayers, getLayerPoints, toggleActiveLayer } from 'redactions/pulse';
import { toggleTooltip } from 'redactions/tooltip';

// Selectors
import getLayersGroupPulse from 'selectors/pulse/layersGroupPulse';
import getActiveLayersPulse from 'selectors/pulse/layersActivePulse';

// Helpers
import LayerGlobeManager from 'utils/layers/LayerGlobeManager';
import { substitution } from 'utils/utils';

// Components
import Globe from 'components/vis/Globe';
import LayerNav from 'components/app/pulse/LayerNav';
import LayerCard from 'components/app/pulse/LayerCard';
import Spinner from 'components/ui/Spinner';
import ZoomControl from 'components/ui/ZoomControl';
import GlobeTooltip from 'components/app/pulse/GlobeTooltip';
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';

const earthImage = '/static/images/components/vis/earth-min.jpg';
const earthBumpImage = '/static/images/components/vis/earth-bump.jpg';
const cloudsImage = '/static/images/components/vis/clouds-min.png';

let Map;
let ImageProvider;
let Cesium;
if (typeof window !== 'undefined') {
  /* eslint-disable */
  Map = require('react-cesium').Map;
  ImageProvider = require('react-cesium').ImageProvider;
  Cesium = window.Cesium;
  Cesium.BingMapsApi.defaultKey = process.env.BING_MAPS_API_KEY;
  /* eslint-enable */
}


class Pulse extends Page {
  constructor(props) {
    super(props);
    this.state = {
      texture: null,
      loading: false,
      selectedMarker: null,
      useDefaultLayer: true,
      markerType: 'default',
      interactionConfig: null
    };
    this.layerGlobeManager = new LayerGlobeManager();

    this.handleMouseHoldOverGlobe = debounce(this.handleMouseHoldOverGlobe.bind(this), 10);
  }

  /**
   * COMPONENT LIFECYCLE
   * - componentDidMount
   * - componentWillReceiveProps
   * - componentWillUnmount
  */
  componentDidMount() {
    super.componentDidMount();
    this.mounted = true;
    // This is not sending anything, for the moment
    this.props.getLayers();
    document.addEventListener('click', this.handleMouseClick);
  }

  componentWillReceiveProps(nextProps) {
    const { layerActive } = this.props.pulse;
    const nextLayerActive = nextProps.pulse.layerActive;
    const lastId = (layerActive) ? layerActive.id : null;
    const newId = (nextLayerActive) ? nextLayerActive.id : null;
    if (lastId !== newId) {
      if (nextLayerActive) {
        this.setState({
          loading: true,
          interactionConfig: nextLayerActive.attributes.interactionConfig
        });

        if (nextLayerActive.threedimensional === 'true') {
          const url = nextLayerActive.attributes.layerConfig.pulseConfig.url;
          this.props.getLayerPoints(url);
        } else {
          this.layerGlobeManager.addLayer(nextLayerActive.attributes, {
            onLayerAddedSuccess: function success(texture) {
              this.setState({
                texture,
                loading: false,
                layerPoints: []
              });
            }.bind(this),
            onLayerAddedError: function error(err) {
              console.error(err);
              this.setState({
                texture: null,
                loading: false,
                layerPoints: []
              });
            }.bind(this)
          });
        }
      } else {
        this.layerGlobeManager.abortRequest();
        this.setState({ texture: null });
      }
    }

    if (nextProps.pulse.layerPoints !== this.props.pulse.layerPoints) {
      if (nextProps.pulse.layerPoints && nextProps.pulse.layerPoints.length > 0) {
        this.setState({
          loading: false,
          layerPoints: nextProps.pulse.layerPoints.slice(0),
          texture: null,
          useDefaultLayer: false,
          markerType: nextLayerActive.markerType
        });
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleMouseClick);
    this.props.toggleTooltip(false);
    this.props.toggleActiveLayer(null);
    this.mounted = false;
  }

  /**
  * UI EVENTS
  * - triggerZoomIn
  * - triggerZoomOut
  * - handleMouseClick
  * - handleMouseDown
  * - handleMarkerSelected
  * - handleEarthClicked
  * - handleClickInEmptyRegion
  * - handleMouseHoldOverGlobe
  */
  handleMouseHoldOverGlobe() {
    this.props.toggleTooltip(false);
  }
  @Autobind
  triggerZoomIn() {
    this.globe.camera.translateZ(-5);
  }
  @Autobind
  triggerZoomOut() {
    this.globe.camera.translateZ(5);
  }
  @Autobind
  handleMouseClick(event) {
    if (event.target.tagName !== 'CANVAS') {
      this.props.toggleTooltip(false);
    }
  }
  @Autobind
  handleMouseDown() {
    this.props.toggleTooltip(false);
  }
  @Autobind
  handleMarkerSelected(marker, event) {
    const tooltipContentObj = this.state.interactionConfig.output.map(elem =>
      ({ key: elem.property, value: marker[elem.column], type: elem.type }));

    if (this.mounted) {
      this.props.toggleTooltip(true, {
        follow: false,
        children: GlobeTooltip,
        childrenProps: { value: tooltipContentObj },
        position: { x: event.clientX, y: event.clientY }
      });
    }
  }
  @Autobind
  handleEarthClicked(latLon, clientX, clientY) {
    const { pulse } = this.props;
    const { interactionConfig } = this.state;
    this.props.toggleTooltip(false);
    if (pulse.layerActive) {
      const requestURL = substitution(interactionConfig.pulseConfig.url,
        [{ key: 'point', value: `[${latLon.longitude}, ${latLon.latitude}]` }]);
      this.setTooltipValue(requestURL, clientX, clientY);
    }
  }
  @Autobind
  handleClickInEmptyRegion() {
    this.props.toggleTooltip(false);
  }

  /**
  * HELPER FUNCTIONS
  * - setTooltipValue
  */
  @Autobind
  setTooltipValue(requestURL, tooltipX, tooltipY) {
    fetch(new Request(requestURL))
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      }).then((response) => {
        if (response.data.length > 0) {
          const obj = response.data[0];

          const tooltipContentObj = this.state.interactionConfig.output.map(elem =>
            ({ key: elem.property, value: obj[elem.column], type: elem.type }));

          this.props.toggleTooltip(true, {
            follow: false,
            children: GlobeTooltip,
            childrenProps: { value: tooltipContentObj },
            position: { x: tooltipX, y: tooltipY }
          });
        }
      });
  }

  @Autobind
  handleCesiumClick(e) {
    const viewer = e.viewer;
    const clickedPosition = e.clickedPosition;
    const mousePosition = new Cesium.Cartesian2(clickedPosition.x, clickedPosition.y);

    const ellipsoid = viewer.scene.globe.ellipsoid;
    const cartesian = viewer.camera.pickEllipsoid(mousePosition, ellipsoid);

    if (cartesian) {
      const cartographic = ellipsoid.cartesianToCartographic(cartesian);
      const longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
      const latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
      this.handleEarthClicked({ longitude: longitudeString, latitude: latitudeString },
        clickedPosition.x, clickedPosition.y + 75); // TODO: 75 is the header height
    }
  }

  @Autobind
  handleCesiumMouseDown() {
    this.props.toggleTooltip(false);
  }

  @Autobind
  handleCesiumMoveStart() {
    this.props.toggleTooltip(false);
  }

  render() {
    const { url, layersGroup, pulse } = this.props;
    const { layerActive, layerPoints } = pulse;
    const threedimensional = layerActive && layerActive.threedimensional === 'true';
    const { markerType, texture, useDefaultLayer } = this.state;
    let shapes = [];
    if (layerPoints) {
      shapes = layerPoints.map((elem) => {
        if (elem.mag) {
          return { ...elem, height: elem.mag * 100000 };
        } else if (elem.displaced) {
          return { ...elem, height: elem.displaced * 10 };
        }
        return elem;
      })
    }

    console.log('layerPoints', layerPoints);

    return (
      <Layout
        title="Planet Pulse"
        description="Planet Pulse description"
        url={url}
        user={this.props.user}
      >
        <div
          className="p-pulse l-map -dark"
        >
          <LayerNav
            layerActive={layerActive}
            layersGroup={layersGroup}
          />
          <LayerCard
            layerActive={layerActive}
          />
          <Spinner
            isLoading={this.state.loading}
          />
        {/* threedimensional &&
            <Globe
              ref={globe => (this.globe = globe)}
              width={globeWidht}
              height={globeHeight}
              pointLightColor={0xcccccc}
              ambientLightColor={0x444444}
              enableZoom
              lightPosition={'right'}
              texture={texture}
              layerPoints={layerPoints}
              markerType={markerType}
              earthImagePath={earthImage}
              earthBumpImagePath={earthBumpImage}
              defaultLayerImagePath={cloudsImage}
              segments={64}
              rings={64}
              useHalo
              useDefaultLayer={useDefaultLayer}
              onMarkerSelected={this.handleMarkerSelected}
              onEarthClicked={this.handleEarthClicked}
              onClickInEmptyRegion={this.handleClickInEmptyRegion}
              onMouseHold={this.handleMouseHoldOverGlobe}
            />
          */}
          {layerActive && window && (texture || threedimensional) &&
            <Map
              className="cesium-map"
              onClick={this.handleCesiumClick}
              onMouseDown={this.handleCesiumMouseDown}
              onMoveStart={this.handleCesiumMoveStart}
              shapes={shapes}
            >
              {texture &&
                <ImageProvider key={texture} url={texture} type="UrlTemplate" visible />
              }
            </Map>
          }
          <ZoomControl
            ref={zoomControl => (this.zoomControl = zoomControl)}
            onZoomIn={this.triggerZoomIn}
            onZoomOut={this.triggerZoomOut}
          />
        </div>
      </Layout>
    );
  }
}

Pulse.propTypes = {
  // ROUTER
  url: PropTypes.object,

  // STORE
  layersGroup: PropTypes.array,
  layerActive: PropTypes.object,
  getLayers: PropTypes.func.isRequired,
  getLayerPoints: PropTypes.func.isRequired,
  toggleTooltip: PropTypes.func.isRequired,
  toggleActiveLayer: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  pulse: state.pulse,
  layersGroup: getLayersGroupPulse(state),
  layerActive: getActiveLayersPulse(state)
});

const mapDispatchToProps = dispatch => ({
  getLayers: () => {
    dispatch(getLayers());
  },
  toggleTooltip: (opened, opts) => {
    dispatch(toggleTooltip(opened, opts));
  },
  getLayerPoints: (id, tableName) => {
    dispatch(getLayerPoints(id, tableName));
  },
  toggleActiveLayer: (id, threedimensional, markerType) => {
    dispatch(toggleActiveLayer(id, threedimensional, markerType));
  }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Pulse);
