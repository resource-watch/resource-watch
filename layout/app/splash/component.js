import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { Router } from 'routes';

// components
import HeadApp from 'layout/head/app';
import Header from 'components/splash/layout/Header';
import GlobeCesium from 'components/vis/globe-cesium';

// constants
import {
  CAMERA_INITIAL_POSITION,
  CAMERA_FINAL_POSITION,
  ANIMATION_DURATION,
  INITIAL_WAIT,
  FINAL_ANIMATION_DURATION,
  MARKERS
} from './constants';

// styles
import './styles.scss';

let Cesium;

class SplashPage extends PureComponent {
  state = {
    billboardHover: false,
    selectedMarker: null,
    viewer: null,
    firstFlight: null,
    secondFlight: null,
    hideSkip: false
  }

  componentDidMount() {
    // Init Cesium var
    Cesium = window.Cesium; // eslint-disable-line prefer-destructuring
    Cesium.BingMapsApi.defaultKey = process.env.BING_MAPS_API_KEY;
  }

  runInitialAnimation() {
    const { viewer: { camera } } = this.state;

    // ------- CAMERA INITIAL POSITION -------
    camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(
        CAMERA_INITIAL_POSITION.lon, CAMERA_INITIAL_POSITION.lat, 90000
      ),
      orientation: {
        heading: 0.0,
        pitch: -1,
        roll: 0.0
      }
    });

    const firstFlight = null;
    // // ------- FIRST FLY -------
    // const firstFlight = setTimeout(() => camera.flyTo({
    //   destination: Cesium.Cartesian3.fromDegrees(
    // CAMERA_FINAL_POSITION.lon, CAMERA_FINAL_POSITION.lat, CAMERA_INITIAL_POSITION.height
    //  ),
    //   orientation: {
    //     heading: CAMERA_INITIAL_POSITION.heading,
    //     pitch: CAMERA_INITIAL_POSITION.pitch,
    //     roll: CAMERA_INITIAL_POSITION.roll
    //   },
    //   duration: ANIMATION_DURATION,
    //   maximumHeight: CAMERA_INITIAL_POSITION.height
    // }), INITIAL_WAIT * 1000);

    // // --- CAMERA CHANGE -----
    // setTimeout(() => {
    //   camera.flyTo({
    //    destination: Cesium.Cartesian3.fromDegrees(
    //      CAMERA_FINAL_POSITION.lon, CAMERA_FINAL_POSITION.lat, 900000
    //    ),
    //     orientation: {
    //       heading: 0.0,
    //       pitch: -Cesium.Math.PI_OVER_TWO,
    //       roll: 0.0
    //     },
    //     duration: 2
    //   });
    // }, (ANIMATION_DURATION * 1000) + (INITIAL_WAIT * 1000));

    // ------- SECOND FLY -------
    const secondFlight = setTimeout(() => {
      camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          CAMERA_FINAL_POSITION.lon, CAMERA_FINAL_POSITION.lat, CAMERA_FINAL_POSITION.height
        ),
        orientation: {
          heading: 0.0,
          pitch: -Cesium.Math.PI_OVER_TWO,
          roll: 0.0
        },
        duration: FINAL_ANIMATION_DURATION,
        maximumHeight: CAMERA_FINAL_POSITION.height
      });
    }, (ANIMATION_DURATION * 1000) + (INITIAL_WAIT * 1000) + 1000);

    setTimeout(() => this.setState({ hideSkip: true }), FINAL_ANIMATION_DURATION * 1000);

    this.setState({ firstFlight, secondFlight });
  }

  handleBillboardClick = (e) => {
    const { name } = e.id;
    this.setState({ selectedMarker: MARKERS.find(elem => elem.name === name) });
  }

  handleBillboardHover= () => { this.setState({ billboardHover: true }); }

  handleBillboardOut= () => { this.setState({ billboardHover: false }); }

  handleVisitButton = () => {
    const { selectedMarker, viewer } = this.state;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(selectedMarker.lon, selectedMarker.lat, 1000.0),
      duration: 3
    });

    setTimeout(() => Router.pushRoute('splash_detail', { id: selectedMarker.routeId }), 3000);
  }

  handleOnInit = (viewer) => { this.setState({ viewer }, this.runInitialAnimation); }

  skipAnimation() {
    const { viewer, firstFlight, secondFlight } = this.state;

    const finalHeight = CAMERA_FINAL_POSITION.height;
    const finalLat = CAMERA_FINAL_POSITION.lat;
    const finalLon = CAMERA_FINAL_POSITION.lon;

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
    const {
      billboardHover,
      selectedMarker,
      hideSkip
    } = this.state;
    const pageClassnames = classnames(
      'l-splash',
      { '-cursor-pointer': billboardHover }
    );

    return (
      <div
        title="Resource Watch"
        className={pageClassnames}
      >
        <HeadApp
          // TO-DO: fill title properly
          title="Splash page"
          // TO-DO: fill description
          description="Splash page description"
        />
        <Header
          showEarthViewLink={false}
          showCredits={false}
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

export default SplashPage;
