/* eslint max-len: 0 */
import React from 'react';
import { Link } from 'routes';
import classnames from 'classnames';
import { Autobind } from 'es-decorators';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Layout
import Page from 'components/app/layout/Page';
import Head from 'components/app/layout/head';

// Components
import Spinner from 'components/ui/Spinner';


// -------PANORAMAS------------
const PANORAMAS = [
  {
    name: 'coral',
    default: 'bleached',
    options: [
      {
        name: 'healthy',
        label: 'Healthy',
        image: '../../static/images/splash/healthy.jpg',
        text: ''
      },
      {
        name: 'bleached',
        label: 'Bleached',
        image: '../../static/images/splash/bleached.jpg',
        text: ''
      },
      {
        name: 'dead',
        label: 'Dead',
        image: '../../static/images/splash/dead.jpg',
        text: ''
      }
    ]
  }
];

class SplashDetail extends Page {
  constructor(props) {
    super(props);
    console.log('props', props);
    const panorama = PANORAMAS.find(p => p.name === props.url.query.id);
    const selectedPanorama = panorama.options.find(e => e.name === panorama.default);
    console.log('selectedPanorama', selectedPanorama);
    this.state = {
      skyLoading: false,
      panorama,
      selectedPanorama
    };
  }

  componentDidMount() {
    super.componentDidMount();
  }

  render() {
    const { selectedPanorama, skyLoading } = this.state;
    const skyImage = selectedPanorama && selectedPanorama.image;
    const text = selectedPanorama && selectedPanorama.text;

    return (
      <div
        title="Resource Watch"
        className="page-splash-detail"
      >
        <Head
          title="SplashDetail page"
          description="SplashDetail page description"
        />
        <div className="header">
          <Link route="home">
            <img src="../../static/images/logo.png" alt="Resource Watch" />
          </Link>
          <Link route="home">
            <a>GO TO RESOURCE WATCH</a>
          </Link>
        </div>
        <div className="panorama">
          <Spinner isLoading={skyLoading} className="-light" />
          <div className="menu">
            <div className="option">
              <input type="radio" id="healthy_button" checked={selectedPanorama === 'healthy'} onChange={this.handlePanoramaChange} />
              <label htmlFor="healthy_button">Healthy</label>
            </div>
            <div className="option">
              <input type="radio" id="bleached_button" checked={selectedPanorama === 'bleached'} onChange={this.handlePanoramaChange} />
              <label htmlFor="bleached_button">Bleached</label>
            </div>
            <div className="option">
              <input type="radio" id="dead_button" checked={selectedPanorama === 'dead'} onChange={this.handlePanoramaChange} />
              <label htmlFor="dead_button">Dead</label>
            </div>
          </div>
          <a-scene embedded>
            { /* 360-degree image */ }
            <a-sky id="panorama-sky" src={skyImage} />

            <a-text
              value={text}
              color="#FFF"
              position="-5 2 -3"
              scale="1.5 1.5 1.5"
            />

            { /* Camera + cursor */ }
            <a-entity camera look-controls>
              <a-cursor
                id="cursor"
                raycaster="objects: .link"
              />
            </a-entity>
          </a-scene>
        </div>
      </div>
    );
  }
}

// const mapStateToProps = state => ();
//
// const mapDispatchToProps = dispatch => ({
//
// });

export default withRedux(initStore, null, null)(SplashDetail);
