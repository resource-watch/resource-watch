import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

// Redux
import { connect } from 'react-redux';
import { getLayers, getLayerPoints, resetLayerPoints } from 'layout/app/pulse/actions';
import { resetActiveLayer } from 'layout/app/pulse/layer-menu/actions';
import { toggleTooltip } from 'redactions/tooltip';

// selectors
import getLayersGroupPulse from 'selectors/pulse/layersGroupPulse';
import getActiveLayersPulse from 'selectors/pulse/layersActivePulse';

// components
import Layout from 'layout/layout/layout-app';
import LayerContainer from 'layout/app/pulse/layer-container';
import LayerMenu from 'layout/app/pulse/layer-menu';
import LayerCard from 'layout/app/pulse/layer-card';
import Spinner from 'components/ui/Spinner';
import GlobeTooltip from 'layout/app/pulse/globe-tooltip';
import GlobeCesium from 'components/vis/globe-cesium';
import WelcomeModal from 'layout/app/pulse/welcome-modal';

// utils
import LayerGlobeManager from 'utils/layers/LayerGlobeManager';
import { substitution } from 'utils/utils';
import { logEvent } from 'utils/analytics';

// styles
import './styles.scss';

// Cesium
let Cesium;

class LayoutPulse extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedMarker: null,
      interactionConfig: null
    };
    this.layerGlobeManager = new LayerGlobeManager();

    // -------------------------- Bindings ----------------------------
    this.handleMouseHoldOverGlobe = debounce(this.handleMouseHoldOverGlobe.bind(this), 10);
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
    // Init Cesium var
    Cesium = window.Cesium; // eslint-disable-line prefer-destructuring
    Cesium.BingMapsApi.defaultKey = process.env.BING_MAPS_API_KEY;

    this.props.getLayers();
    document.addEventListener('click', this.handleMouseClick);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { layerActive } = this.props.layerMenuPulse;
    const nextLayerActive = nextProps.layerMenuPulse.layerActive;
    const lastId = (layerActive) ? layerActive.id : null;
    const newId = (nextLayerActive) ? nextLayerActive.id : null;
    if (lastId !== newId) {
      if (nextLayerActive) {
        this.setState({ interactionConfig: nextLayerActive.interactionConfig });

        if (nextLayerActive.threedimensional) {
          const url = nextLayerActive.layerConfig.pulseConfig.url;
          this.props.getLayerPoints(url);
        } else {
          this.props.resetLayerPoints();
        }
      } else {
        this.layerGlobeManager.abortRequest();
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleMouseClick);
    this.props.toggleTooltip(false);
    this.props.resetActiveLayer();
    this.props.resetLayerPoints();
    this.mounted = false;
  }

  /**
  * UI EVENTS
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
    const { layerMenuPulse } = this.props;
    const { interactionConfig } = this.state;
    this.props.toggleTooltip(false);

    if (layerMenuPulse.layerActive && interactionConfig.pulseConfig) {
      const requestURL = substitution(
        interactionConfig.pulseConfig.url,
        [{ key: 'point', value: `[${latLon.longitude}, ${latLon.latitude}]` }]
      );
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
    const { layerMenuPulse } = this.props;
    const { viewer, clickedPosition } = e;
    const { scene, camera } = viewer;
    const { globe } = scene;
    const { ellipsoid } = globe;
    const threedimensional = layerMenuPulse.layerActive &&
      layerMenuPulse.layerActive.threedimensional;
    const mousePosition = new Cesium.Cartesian2(clickedPosition.x, clickedPosition.y);

    const cartesian = camera.pickEllipsoid(mousePosition, ellipsoid);

    if (cartesian && threedimensional !== 'true') {
      const cartographic = ellipsoid.cartesianToCartographic(cartesian);
      const longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
      const latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
      this.handleEarthClicked(
        { longitude: longitudeString, latitude: latitudeString },
        clickedPosition.x, clickedPosition.y + 75
      ); // TODO: 75 is the header height
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
      layersGroup,
      layerMenuPulse,
      pulse,
      globeCesium
    } = this.props;
    const { layerActive } = layerMenuPulse;
    // const { layerPoints } = pulse;
    // const shapes = this.getShapes(layerPoints, layerActive && layerActive.markerType);

    // Check if there's a custom basemap
    const basemap = layerActive && layerActive.basemap;

    return (
      <Layout
        title="Near Real-Time Data — Resource Watch"
        description="Near Real-Time Data provides a snapshot of our changing world."
        className="l-pulse"
      >
        <div
          className="pulse-container -dark"
        >
          <WelcomeModal />
          <Spinner
            isLoading={
              pulse.loading ||
              layerMenuPulse.loading ||
              (pulse.layerPoints.length > 0 && !globeCesium.shapesCreated)
            }
          />
          <GlobeCesium
            basemap={basemap}
            contextLayersOnTop={layerActive && layerActive.contextLayersOnTop}
            onClick={this.handleCesiumClick}
            onMouseDown={this.handleCesiumMouseDown}
            onMoveStart={this.handleCesiumMoveStart}
            onShapesCreated={this.handleShapesCreated}
          />
          <LayerContainer>
            <LayerMenu
              layerActive={layerActive}
              layersGroup={layersGroup}
            />
            <LayerCard />
          </LayerContainer>
        </div>
      </Layout>
    );
  }
}

LayoutPulse.propTypes = {
  layersGroup: PropTypes.array,
  layerActive: PropTypes.object,
  getLayers: PropTypes.func.isRequired,
  getLayerPoints: PropTypes.func.isRequired,
  toggleTooltip: PropTypes.func.isRequired,
  resetActiveLayer: PropTypes.func.isRequired
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
  resetActiveLayer,
  resetLayerPoints
};

export default connect(mapStateToProps, mapDispatchToProps)(LayoutPulse);
