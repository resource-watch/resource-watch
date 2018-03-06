import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { getLayers, getLayerPoints, resetLayerPoints } from 'pages/app/pulse/actions';
import { toggleActiveLayer } from 'pages/app/pulse/layer-menu-dropdown/actions';
import { toggleTooltip } from 'redactions/tooltip';

// Selectors
import getLayersGroupPulse from 'selectors/pulse/layersGroupPulse';
import getActiveLayersPulse from 'selectors/pulse/layersActivePulse';

// Helpers
import LayerGlobeManager from 'utils/layers/LayerGlobeManager';
import { substitution } from 'utils/utils';

// Utils
import { logEvent } from 'utils/analytics';

// Components
import LayerMenu from 'pages/app/pulse/layer-menu';
import LayerCard from 'pages/app/pulse/layer-card';
import Spinner from 'components/ui/Spinner';
import ZoomControl from 'components/ui/ZoomControl';
import GlobeTooltip from 'pages/app/pulse/globe-tooltip';
import GlobeCesium from 'pages/app/pulse/globe-cesium';
import Page from 'components/layout/page';
import Layout from 'components/layout/layout/layout-app';

class Pulse extends Page {
  constructor(props) {
    super(props);
    this.state = {
      texture: null,
      selectedMarker: null,
      interactionConfig: null,
      zoom: 0
    };
    this.layerGlobeManager = new LayerGlobeManager();

    // -------------------------- Bindings ----------------------------
    this.handleMouseHoldOverGlobe = debounce(this.handleMouseHoldOverGlobe.bind(this), 10);
    this.triggerZoomIn = this.triggerZoomIn.bind(this);
    this.triggerZoomOut = this.triggerZoomOut.bind(this);
    this.handleMouseClick = this.handleMouseClick.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMarkerSelected = this.handleMarkerSelected.bind(this);
    this.handleEarthClicked = this.handleEarthClicked.bind(this);
    this.handleClickInEmptyRegion = this.handleClickInEmptyRegion.bind(this);
    this.setTooltipValue = this.setTooltipValue.bind(this);
    this.handleCesiumClick = this.handleCesiumClick.bind(this);
    this.handleCesiumMouseDown = this.handleCesiumMouseDown.bind(this);
    this.handleCesiumMoveStart = this.handleCesiumMoveStart.bind(this);
    this.handleShapesCreated = this.handleShapesCreated.bind(this);
    //------------------------------------------------------------------
  }

  /**
   * COMPONENT LIFECYCLE
   * - componentDidMount
   * - componentWillReceiveProps
   * - componentWillUnmount
  */
  componentDidMount() {
    this.props.getLayers();
    document.addEventListener('click', this.handleMouseClick);
  }

  componentWillReceiveProps(nextProps) {
    const { layerActive } = this.props.layerMenuPulse;
    const nextLayerActive = nextProps.layerMenuPulse.layerActive;
    const lastId = (layerActive) ? layerActive.id : null;
    const newId = (nextLayerActive) ? nextLayerActive.id : null;
    if (lastId !== newId) {
      if (nextLayerActive) {
        this.setState({
          interactionConfig: nextLayerActive.attributes.interactionConfig
        });

        if (nextLayerActive.threedimensional) {
          const url = nextLayerActive.attributes.layerConfig.pulseConfig.url;
          this.props.getLayerPoints(url);
        } else {
          this.props.resetLayerPoints();
          this.layerGlobeManager.addLayer(nextLayerActive.attributes, {
            onLayerAddedSuccess: function success(result) {
              this.setState({
                texture: result.url
              });
            }.bind(this),
            onLayerAddedError: function error(err) {
              console.error(err);
              this.setState({
                texture: null
              });
            }.bind(this)
          });
        }
      } else {
        this.layerGlobeManager.abortRequest();
        this.setState({ texture: null });
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleMouseClick);
    this.props.toggleTooltip(false);
    this.props.toggleActiveLayer({});
    this.props.resetLayerPoints();
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
  triggerZoomIn() {
    this.setState({ zoom: this.state.zoom - 1000000 });
  }
  triggerZoomOut() {
    this.setState({ zoom: this.state.zoom + 1000000 });
  }
  handleMouseClick(event) {
    if (event.target.tagName !== 'CANVAS') {
      this.props.toggleTooltip(false);
    }
  }
  handleMouseDown() {
    this.props.toggleTooltip(false);
  }
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
  handleEarthClicked(latLon, clientX, clientY) {
    const { pulse } = this.props;
    const { interactionConfig } = this.state;
    this.props.toggleTooltip(false);

    if (pulse.layerActive && interactionConfig.pulseConfig) {
      const requestURL = substitution(interactionConfig.pulseConfig.url,
        [{ key: 'point', value: `[${latLon.longitude}, ${latLon.latitude}]` }]);
      this.setTooltipValue(requestURL, clientX, clientY);
      logEvent('Planet Pulse', 'Click a datapoint', `${latLon.latitude},${latLon.longitude}`);
    }
  }
  handleClickInEmptyRegion() {
    this.props.toggleTooltip(false);
  }

  /**
  * HELPER FUNCTIONS
  * - setTooltipValue
  */
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

  handleCesiumClick(e) {
    const threedimensional = this.props.layerMenuPulse.layerActive &&
      this.props.layerMenuPulse.layerActive.threedimensional;
    const viewer = e.viewer;
    const clickedPosition = e.clickedPosition;
    const mousePosition = new Cesium.Cartesian2(clickedPosition.x, clickedPosition.y);

    const ellipsoid = viewer.scene.globe.ellipsoid;
    const cartesian = viewer.camera.pickEllipsoid(mousePosition, ellipsoid);

    if (cartesian && threedimensional !== 'true') {
      const cartographic = ellipsoid.cartesianToCartographic(cartesian);
      const longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
      const latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
      this.handleEarthClicked({ longitude: longitudeString, latitude: latitudeString },
        clickedPosition.x, clickedPosition.y + 75); // TODO: 75 is the header height
    }
  }

  handleCesiumMouseDown() {
    this.props.toggleTooltip(false);
  }

  handleCesiumMoveStart() {
    this.props.toggleTooltip(false);
  }

  handleShapesCreated() {
    this.setState({ loading: false });
  }

  render() {
    const {
      url,
      layersGroup,
      layerMenuPulse,
      pulse,
      globeCesium
    } = this.props;
    const { layerActive } = layerMenuPulse;
    // const { layerPoints } = pulse;
    const { texture, zoom } = this.state;
    // const shapes = this.getShapes(layerPoints, layerActive && layerActive.markerType);

    // Check if there's a custom basemap
    const basemap = layerActive && layerActive.basemap;

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
          <LayerMenu
            layerActive={layerActive}
            layersGroup={layersGroup}
          />
          <LayerCard />
          <Spinner
            isLoading={
              pulse.loading ||
              layerMenuPulse.loading ||
              (pulse.layerPoints.length > 0 && !globeCesium.shapesCreated)
            }
          />
          <GlobeCesium
            basemap={basemap}
            zoom={zoom}
            mainLayer={texture}
            contextLayersOnTop={layerActive && layerActive.contextLayersOnTop}
          />
          <ZoomControl
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
  layerMenuPulse: state.layerMenuPulse,
  pulse: state.pulse,
  layersGroup: getLayersGroupPulse(state),
  layerActive: getActiveLayersPulse(state),
  globeCesium: state.globeCesium
});

const mapDispatchToProps = {
  getLayers,
  toggleTooltip,
  getLayerPoints,
  toggleActiveLayer,
  resetLayerPoints
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Pulse);
