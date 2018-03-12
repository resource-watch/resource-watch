/* eslint max-len: 0 */
import React from 'react';
import classnames from 'classnames';
import { Router } from 'routes';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { getInsights } from 'redactions/insights';

// Layout
import Page from 'components/layout/page';
import Head from 'components/layout/head/app';
import Header from 'components/splash/layout/Header';

// Utils
import { MARKERS } from 'utils/splash/Markers';

// Components
import GlobeCesium from 'pages/app/pulse/globe-cesium';

let Cesium;

const CAMERA_INITIAL_POSITION = {
  lat: 35.46,
  lon: -3.55,
  height: 90000,
  pitch: -0.3,
  heading: 0,
  roll: 0
};
const CAMERA_FINAL_POSITION = {
  lat: 49.2002,
  lon: -0.1382,
  height: 20000000,
  pitch: -0.3,
  heading: 0,
  roll: 0
};
const ANIMATION_DURATION = 15;
const INITIAL_WAIT = 6000;
const FINAL_ANIMATION_DURATION = 8;

class Splash extends Page {
  constructor(props) {
    super(props);

    this.state = {
      billboardHover: false,
      selectedMarker: null,
      viewer: null,
      firstFlight: null,
      secondFlight: null,
      hideSkip: false
    };

    // ---------------------- Bindings --------------------------
    this.handleBillboardClick = this.handleBillboardClick.bind(this);
    this.handleBillboardHover = this.handleBillboardHover.bind(this);
    this.handleBillboardOut = this.handleBillboardOut.bind(this);
    this.handleVisitButton = this.handleVisitButton.bind(this);
    this.handleOnInit = this.handleOnInit.bind(this);
    // ----------------------------------------------------------
  }

  componentDidMount() {
    // Init Cesium var
    Cesium = window.Cesium; // eslint-disable-line prefer-destructuring
    Cesium.BingMapsApi.defaultKey = process.env.BING_MAPS_API_KEY;
  }

  runInitialAnimation() {
    const { viewer, cancelAnimations } = this.state;
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
    const firstFlight = setTimeout(() => camera.flyTo({
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
    const secondFlight = setTimeout(() => camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(finalLon, finalLat, finalHeight),
      orientation: {
        heading: 0.0,
        pitch: -Cesium.Math.PI_OVER_TWO,
        roll: 0.0
      },
      duration: finalAnimationDuration,
      maximumHeight: initialHeight + 9000000
    }), timeoutTime + INITIAL_WAIT);

    setTimeout(() => this.setState({ hideSkip: true }), (timeoutTime + INITIAL_WAIT) + finalAnimationDuration);

    this.setState({ firstFlight, secondFlight });
  }

  handleBillboardClick(e) {
    const name = e.id.name; // eslint-disable-line prefer-destructuring
    this.setState({ selectedMarker: MARKERS.find(elem => elem.name === name) });
  }

  handleBillboardHover() {
    this.setState({ billboardHover: true });
  }

  handleBillboardOut() {
    this.setState({ billboardHover: false });
  }

  handleVisitButton() {
    const { selectedMarker, viewer } = this.state;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(selectedMarker.lon, selectedMarker.lat, 1000.0),
      duration: 3
    });

    setTimeout(() => Router.pushRoute('splash_detail', { id: selectedMarker.routeId }), 3000);
  }

  handleOnInit(viewer) {
    console.log('onINit');
    this.setState({ viewer }, this.runInitialAnimation);
  }

  skipAnimation() {
    const { viewer, firstFlight, secondFlight } = this.state;
    const { query } = this.props.url;

    const finalHeight = query.finalHeight ? Number(query.finalHeight) : CAMERA_FINAL_POSITION.height;
    const finalLat = query.finalLat ? Number(query.finalLat) : CAMERA_FINAL_POSITION.lat;
    const finalLon = query.finalLon ? Number(query.finalLon) : CAMERA_FINAL_POSITION.lon;

    // remember to cancel any active or qued animation
    viewer.camera.cancelFlight();
    clearTimeout(firstFlight);
    clearTimeout(secondFlight);

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(finalLon, finalLat, finalHeight),
      orientation: {
        heading: 0.0,
        pitch: -Cesium.Math.PI_OVER_TWO,
        roll: 0.0
      }
    });

    this.setState({ hideSkip: true });
  }

  render() {
    const { billboardHover, selectedMarker, hideSkip } = this.state;

    const pageClassnames = classnames({
      'page-splash': true,
      '-cursor-pointer': billboardHover
    });

    return (
      <div
        title="Resource Watch"
        className={pageClassnames}
      >
        <Head
          title="Splash page"
          description="Splash page description"
        />
        <Header
          showEarthViewLink={false}
          skipAnimation={() => this.skipAnimation()}
          hideSkip={hideSkip}
        />
        <GlobeCesium
          markers={MARKERS}
          onBillboardClick={this.handleBillboardClick}
          onBillboardHover={this.handleBillboardHover}
          onBillboardOut={this.handleBillboardOut}
          onClick={this.handleMouseClick}
          onInit={this.handleOnInit}
          viewerOptions={{
            sceneModePicker: false,
            selectionIndicator: false,
            infoBox: false
          }}
        />
        {selectedMarker &&
          <div className="right-section">
            <div className="detail-container">
              <h2>{selectedMarker.name}</h2>
              <div className="image-container">
                <img src={selectedMarker.thumbnail} alt={selectedMarker.name} />
              </div>
              <div className="text-container">
                {selectedMarker.text}
              </div>
              <div className="visit-container">
                <a
                  className="visit-button"
                  onClick={this.handleVisitButton}
                  role="button"
                  tabIndex={-1}
                >
                  <img src="/static/images/splash/play.svg" alt="Visit this place" />
                  {selectedMarker.cta}
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

const mapDispatchToProps = {
  getInsights
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Splash);
