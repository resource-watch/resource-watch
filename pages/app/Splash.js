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

const CAMERA_INITIAL_POSITION = { lat: 35.46, lon: -3.55, height: 90000 };
const CAMERA_NEW_POSITION = { lat: 49.2002, lon: -0.1382, height: 20000000 };


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
    // const center = Cesium.Cartesian3.fromDegrees(CAMERA_INITIAL_POSITION.lon, CAMERA_INITIAL_POSITION.lat);
    // camera.lookAt(center, new Cesium.Cartesian3(0.0, 0.0, CAMERA_INITIAL_POSITION.height));
    camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(CAMERA_INITIAL_POSITION.lon, CAMERA_INITIAL_POSITION.lat, CAMERA_INITIAL_POSITION.height),
      orientation: {
        heading: 0.0,
        pitch: -0.3,
        roll: 0.0
      }
    });
    setTimeout(() => camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(CAMERA_NEW_POSITION.lon, CAMERA_NEW_POSITION.lat, CAMERA_INITIAL_POSITION.height),
      orientation: {
        heading: 0.0,
        pitch: -0.3,
        roll: 0.0
      },
      duration: 15,
      maximumHeight: CAMERA_INITIAL_POSITION.height
    }), 6000);
    setTimeout(() => camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(CAMERA_NEW_POSITION.lon, CAMERA_NEW_POSITION.lat, CAMERA_NEW_POSITION.height),
      orientation: {
        heading: 0.0,
        pitch: -Cesium.Math.PI_OVER_TWO,
        roll: 0.0
      },
      duration: 8,
      maximumHeight: CAMERA_INITIAL_POSITION.height + 9000000
    }), 16000);
  }

  handleMouseMove(e) {

  }

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
      duration: 5
    });
    Router.pushRoute('splash_detail', { id: selectedMarker.routeId });
  }

  @Autobind
  handleMouseClick(e) {
  }

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
