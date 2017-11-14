/* eslint max-len: 0 */
import React from 'react';
import { Link } from 'routes';
import classnames from 'classnames';
import { Autobind } from 'es-decorators';
import { Router } from 'routes';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { getInsights } from 'redactions/insights';

// Layout
import Page from 'components/app/layout/Page';
import Head from 'components/app/layout/head';

// Components

let Map;
let Cesium;
if (typeof window !== 'undefined') {
  /* eslint-disable */
  Map = require('react-cesium').Map;
  /* eslint-enable */
}

const MARKERS = [
  {
    name: 'Tropical deforestation',
    lat: 0.076,
    lon: 101,
    type: 'billboard',
    image: '../../static/images/splash/marker.svg',
    imageSelected: '../../static/images/splash/markerSelected.svg',
    imageNotSelected: '../../static/images/splash/marker.svg'
  },
  {
    name: 'Coral bleaching',
    lat: -21,
    lon: 151,
    type: 'billboard',
    image: '../../static/images/splash/marker.svg',
    imageSelected: '../../static/images/splash/markerSelected.svg',
    imageNotSelected: '../../static/images/splash/marker.svg',
    thumbnail: '../../static/images/splash/bleached.jpg',
    routeId: 'coral'
  }
];

const CAMERA_INITIAL_POSITION = { lat: 35.46, lon: -3.55, height: 90000, pitch: -0.3, heading: 0, roll: 0 };
const CAMERA_FINAL_POSITION = { lat: 49.2002, lon: -0.1382, height: 20000000, pitch: -0.3, heading: 0, roll: 0 };
const ANIMATION_DURATION = 15;
const INITIAL_WAIT = 6000;
const FINAL_ANIMATION_DURATION = 8;


class Splash extends Page {
  constructor(props) {
    super(props);

    this.state = {
      billboardHover: false,
      selectedMarker: null,
      viewer: null
    };
  }

  componentDidMount() {
    super.componentDidMount();

    // Init Cesium var
    Cesium = window.Cesium;
    Cesium.BingMapsApi.defaultKey = process.env.BING_MAPS_API_KEY;

    this.setState({ mounted: true }); // eslint-disable-line react/no-did-mount-set-state
  }

  runInitialAnimation() {
    const { viewer } = this.state;
    const { camera } = viewer;
    // ------ INIT VARIABLES -----
    const { query } = this.props.url;
    const duration = query.duration ? Number(query.duration) : ANIMATION_DURATION;
    const initialLat = query.initialLat ? Number(query.initialLat) : CAMERA_INITIAL_POSITION.lat;
    const initialLon = query.initialLon ? Number(query.initialLon) : CAMERA_INITIAL_POSITION.lon;
    const initialHeight = query.initialHeight ? Number(query.initialHeight) : CAMERA_INITIAL_POSITION.height;
    const finalLat = query.finalLat ? Number(query.finalLat) : CAMERA_FINAL_POSITION.lat;
    const finalLon = query.finalLon ? Number(query.finalLon) : CAMERA_FINAL_POSITION.lon;
    const finalHeight = query.finalHeight ? Number(query.finalHeight) : CAMERA_FINAL_POSITION.height;
    const finalAnimationDuration = query.finalAnimationDuration ? Number(query.finalAnimationDuration) : FINAL_ANIMATION_DURATION;
    const initialHeading = query.initialHeading ? Number(query.initialHeading) : CAMERA_INITIAL_POSITION.heading;
    const initialRoll = query.initialRoll ? Number(query.initialRoll) : CAMERA_INITIAL_POSITION.roll;
    const initialPitch = query.initialPitch ? Number(query.initialPitch) : CAMERA_INITIAL_POSITION.pitch;
    const finalHeading = query.finalHeading ? Number(query.finalHeading) : CAMERA_FINAL_POSITION.heading;
    const finalRoll = query.finalRoll ? Number(query.finalRoll) : CAMERA_FINAL_POSITION.roll;
    const finalPitch = query.finalPitch ? Number(query.finalPitch) : CAMERA_FINAL_POSITION.pitch;
    // --------------------------

    // ------- CAMERA INITIAL POSITION -------
    camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(initialLon, initialLat, initialHeight),
      orientation: {
        heading: initialHeading,
        pitch: initialPitch,
        roll: initialRoll
      }
    });
    // ------- FIRST FLY -------
    setTimeout(() => camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(finalLon, finalLat, initialHeight),
      orientation: {
        heading: finalHeading,
        pitch: finalPitch,
        roll: finalRoll
      },
      duration,
      maximumHeight: initialHeight
    }), INITIAL_WAIT);

    const timeoutTime = (Number(duration) + 1) * 1000;

    // ------- SECOND FLY -------
    setTimeout(() => camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(finalLon, finalLat, finalHeight),
      orientation: {
        heading: 0.0,
        pitch: -Cesium.Math.PI_OVER_TWO,
        roll: 0.0
      },
      duration: finalAnimationDuration,
      maximumHeight: initialHeight + 9000000
    }), timeoutTime + INITIAL_WAIT);
  }

  // handleMouseMove(e) {
  //
  // }

  @Autobind
  handleBillboardClick(e) {
    const name = e.id.name;
    this.setState({ selectedMarker: MARKERS.find(elem => elem.name === name) });
  }

  @Autobind
  handleBillboardHover() {
    this.setState({ billboardHover: true });
  }

  @Autobind
  handleBillboardOut() {
    this.setState({ billboardHover: false });
  }

  @Autobind
  handleVisitButton() {
    const { selectedMarker, viewer } = this.state;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(selectedMarker.lon, selectedMarker.lat, 1000.0),
      duration: 3
    });
    // Router.pushRoute('splash_detail', { id: selectedMarker.routeId });
    setTimeout(() => { window.location = `/splash/${selectedMarker.routeId}`; }, 3000);
  }

  // @Autobind
  // handleMouseClick(e) {
  // }

  @Autobind
  handleOnInit(viewer) {
    this.setState({ viewer }, this.runInitialAnimation);
  }

  render() {
    const { mounted, billboardHover, selectedMarker } = this.state;
    const cesiumClassname = classnames({
      'cesium-map': true,
      '-cursor-pointer': billboardHover
    });

    return (
      <div
        title="Resource Watch"
        className="page-splash"
      >
        <Head
          title="Splash page"
          description="Splash page description"
        />
        <div className="header">
          <Link route="home">
            <img src="../../static/images/logo.png" alt="Resource Watch" />
          </Link>
          <Link route="home">
            <a>GO TO RESOURCE WATCH</a>
          </Link>
        </div>
        {mounted &&
          <Map
            className={cesiumClassname}
            shapes={MARKERS}
            homeButton={false}
            navigationHelpButton={false}
            selectionIndicator={false}
            showInfoWindow={false}
            onBillboardClick={this.handleBillboardClick}
            onBillboardHover={this.handleBillboardHover}
            onBillboardOut={this.handleBillboardOut}
            onClick={this.handleMouseClick}
            onInit={this.handleOnInit}
          />
        }
        {selectedMarker &&
          <div className="right-section">
            <div className="thumbnail-container">
              <div className="title-container">
                {selectedMarker.name}
              </div>
              <div className="visit-container">
                <img src={selectedMarker.thumbnail} alt={selectedMarker.name} />
                <a
                  className="visit-button"
                  onClick={this.handleVisitButton}
                  role="button"
                  tabIndex={-1}
                >
                  VISIT THIS PLACE
                </a>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({ insights: state.insights.list });

const mapDispatchToProps = dispatch => ({
  getInsights: () => dispatch(getInsights())
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Splash);
