/* eslint max-len: 0 */
import React from 'react';
import { Link } from 'routes';

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
    image: '../../static/images/marker.png'
  },
  {
    name: 'Coral bleaching',
    lat: -21,
    lon: 151,
    type: 'billboard',
    image: '../../static/images/marker.png'
  }
];


class Splash extends Page {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    super.componentDidMount();

    // Init Cesium var
    Cesium = window.Cesium;
    Cesium.BingMapsApi.defaultKey = process.env.BING_MAPS_API_KEY;

    this.setState({ mounted: true }); // eslint-disable-line react/no-did-mount-set-state
  }

  handleMouseMove(e) {
    const { hoverPosition, endPosition, viewer } = e;
    const pickedFeature = viewer.scene.pick(endPosition);
    if (!Cesium.defined(pickedFeature)) {

    } else {
      console.log('pickedFeature', pickedFeature);
    }
  }

  render() {
    const { mounted } = this.state;
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
            className="cesium-map"
            shapes={MARKERS}
            homeButton={false}
            navigationHelpButton={false}
            selectionIndicator={false}
            onMouseMove={this.handleMouseMove}
          />
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
