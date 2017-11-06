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
import LayerNav from 'components/app/pulse/LayerNav';
import LayerCard from 'components/app/pulse/LayerCard';
import Spinner from 'components/ui/Spinner';
import ZoomControl from 'components/ui/ZoomControl';
import GlobeTooltip from 'components/app/pulse/GlobeTooltip';
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';

let Map;
let ImageProvider;
let Cesium;
if (typeof window !== 'undefined') {
  /* eslint-disable */
  Map = require('react-cesium').Map;
  ImageProvider = require('react-cesium').ImageProvider;
  /* eslint-enable */
}

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


class Pulse extends Page {
  constructor(props) {
    super(props);
    this.state = {
      texture: null,
      loading: false,
      selectedMarker: null,
      useDefaultLayer: true,
      markerType: 'default',
      interactionConfig: null,
      zoom: 0
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
    // Init Cesium var
    Cesium = window.Cesium;
    Cesium.BingMapsApi.defaultKey = process.env.BING_MAPS_API_KEY;

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

  getShapes(layerPoints, markerType) {
    let shapes = [];
    if (layerPoints) {
      shapes = layerPoints.map((elem) => {
        const tooltipContentObj = this.state.interactionConfig.output.map(obj =>
          ({ key: obj.property, value: elem[obj.column], type: obj.type }));
        const description = tooltipContentObj.map(
          (val) => {
            if (val.type === 'url') {
              return `<strong>${val.key}</strong>: <a href=${val.value} target="_blank">${val.value}</a>`;
            } else { // eslint-disable-line no-else-return
              return `<strong>${val.key}</strong>: ${val.value}`;
            }
          }
        );

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
        if (+elem.displaced) {
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
          color
        };
      });
    }
    return shapes;
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
    this.setState({ zoom: this.state.zoom - 1000000 });
  }
  @Autobind
  triggerZoomOut() {
    this.setState({ zoom: this.state.zoom + 1000000 });
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
    const threedimensional = this.props.pulse.layerActive &&
      this.props.pulse.layerActive.threedimensional;
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
    const { markerType, texture, useDefaultLayer, zoom } = this.state;
    const shapes = this.getShapes(layerPoints, markerType);

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
          {this.mounted &&
            <Map
              className="cesium-map"
              onClick={this.handleCesiumClick}
              onMouseDown={this.handleCesiumMouseDown}
              onMoveStart={this.handleCesiumMoveStart}
              shapes={shapes}
              zoom={zoom}
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
