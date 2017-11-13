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
        text: 'What might resemble a beautiful snowfall is actually a destructive stress response known as coral bleaching, which occurred in Airport Reef in 2015. Prolonged exposure to warmer ocean temperatures can cause corals to expel their symbiotic algae (which gives color to corals and nourishes them through photosynthesis), leaving the corals’ white skeletons visible. Some corals are able to bounce back from a bleaching event if water temperatures decrease fast enough. In a warming ocean, however, corals will have less time to recover between bleaching events, and widespread die-off could occur.\nPhoto date: February 2, 2015',
        hotspots: [
          {
            title: 'Coral bleaching on the rise',
            position: '10 2 -10'
          }
        ]
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
    const panorama = PANORAMAS.find(p => p.name === props.url.query.id);
    const selectedPanorama = panorama.options.find(e => e.name === panorama.default);
    this.state = {
      skyLoading: false,
      panorama,
      selectedPanorama,
      showDragHelp: true
    };
  }

  componentDidMount() {
    super.componentDidMount();

    this.panoramaSky = document.getElementById('panorama-sky');
    this.panoramaSky.addEventListener('materialtextureloaded', this.handleImageLoaded);
    document.addEventListener('mousedown', this.hideDragHelp);
  }

  @Autobind
  handlePanoramaChange(event) {
    const { panorama } = this.state;
    const radioButtonId = event.target.getAttribute('id');
    this.setState({
      selectedPanorama: panorama.options.find(e => e.name === radioButtonId),
      skyLoading: true
    });
  }

  @Autobind
  handleImageLoaded() {
    this.setState({ skyLoading: false });
  }

  @Autobind
  hideDragHelp() {
    this.setState({ showDragHelp: false });
    document.removeEventListener('click', this.hideDragHelp);
  }

  render() {
    const { selectedPanorama, skyLoading, panorama, showDragHelp } = this.state;
    const skyImage = selectedPanorama && selectedPanorama.image;
    const text = selectedPanorama && selectedPanorama.text;
    const hotspots = selectedPanorama && selectedPanorama.hotspots;
    const options = panorama && panorama.options;

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
          <div className="links">
            <div className="earth-view-link">
              <Link route="splash">
                <img src="../../static/images/splash/globe.svg" alt="Earth view" />
              </Link>
              <Link route="splash">
                <a>EARTH VIEW</a>
              </Link>
            </div>
            <Link route="home">
              <a>GO TO RESOURCE WATCH</a>
            </Link>
          </div>
        </div>
        <div className="panorama">
          <Spinner isLoading={skyLoading} className="-light" />
          <div className="menu">
            {options && options.map(elem => (
              <div className="option" key={elem.name}>
                <input type="radio" id={elem.name} checked={selectedPanorama.name === elem.name} onChange={this.handlePanoramaChange} />
                <label htmlFor={elem.name}>{elem.label}</label>
              </div>
            ))
            }
          </div>
          <a-scene embedded>

            <a-assets>
              <img id="marker" src="../../static/images/splash/marker.svg" alt="" />
              <img id="markerSelected" src="../../static/images/splash/markerSelected.svg" alt="" />
            </a-assets>

            { /* 360-degree image */ }
            <a-sky id="panorama-sky" src={skyImage} />

            <a-text
              value={text}
              color="#FFF"
              position="-10 2 -10"
              scale="1.5 1.5 1.5"
            />

            { /* Hotspots */ }
            {hotspots && hotspots.map(elem => (
              <a-entity
                position={elem.position}
                key={elem.title}
                geometry="primitive: plane; height: 1; width: 1"
                material="shader: flat; src: #markerSelected; transparent: true"
                event-set__enter="_event: mouseenter; scale: 1.2 1.2 1"
                event-set__leave="_event: mouseleave; scale: 1 1 1"
              />
            ))}

            { /* Camera + cursor */ }
            <a-entity camera look-controls="reverseMouseDrag: true">
              <a-cursor
                id="cursor"
                raycaster="objects: .link"
              />
            </a-entity>
          </a-scene>
        </div>
        {showDragHelp &&
          <div className="drag-help">
            <img src="../../static/images/splash/drag.svg" alt="Drag" />
          </div>
        }
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
