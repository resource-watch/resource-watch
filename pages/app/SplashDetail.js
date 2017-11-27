/* eslint max-len: 0 */
import React from 'react';
import { Link } from 'routes';
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
    backgroundSound: 'https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/sounds/CoralBleachBackgroundSound.mp3',
    options: [
      {
        name: 'healthy',
        label: 'Healthy',
        image: 'https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/images/healthy-optimized.jpg',
        text: ''
      },
      {
        name: 'bleached',
        label: 'Bleached',
        image: 'https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/images/bleached-optimized.jpg',
        text: 'What might resemble a beautiful snowfall is actually a destructive stress response known as coral bleaching, which occurred in Airport Reef in 2015. Prolonged exposure to warmer ocean temperatures can cause corals to expel their symbiotic algae (which gives color to corals and nourishes them through photosynthesis), leaving the corals’ white skeletons visible. Some corals are able to bounce back from a bleaching event if water temperatures decrease fast enough. In a warming ocean, however, corals will have less time to recover between bleaching events, and widespread die-off could occur.\nPhoto date: February 2, 2015',
        intro: '../../static/images/splash/coral-intro.png',
        hotspots: [
          {
            title: 'Coral bleaching on the rise',
            id: 'coral_bleaching_on_the_rise',
            position: '-10 2 -10',
            text: 'Since the 1980s, warmer ocean temperatures have contributed to more frequent and more harmful coral bleaching events around the world. From 1980 to 1997, some 370 incidents of coral bleaching and disease were reported. From 1998 to 2010, that number exploded to more than 3,700. (This jump mostly reflects the destructive effect of rising ocean temperatures, though it should be noted that growing awareness, monitoring, and communication of coral bleaching as an issue also played a role.)\n The spike in 1998, which represents the first global coral bleaching event, was abnormally high; but, as the graph shows, the frequency and severity of coral bleaching events dramatically increased in the following years as well.',
            image: '../../static/images/splash/coral_bleaching_on_the_rise.png',
            imageSelected: '../../static/images/splash/coral_bleaching_on_the_rise_active.png',
            widget: <iframe src="https://staging.resourcewatch.org/embed/widget/a47df7b0-0cdb-4fc2-a877-7c4324c1d6fa" width="100%" height="474" frameBorder="0"></iframe>
          },
          {
            title: 'Coral bleaching up close',
            id: 'coral_bleaching_up_close',
            position: '10 2 -10',
            text: 'When researchers at the Queensland University of Technology in Australia put corals in tanks and turned up the heat by several degrees, the corals began violently spewing out the algae Symbiodinium in a matter of hours. It’s essentially coral bleaching on fast-forward. The university captured the process in this time-lapse video.\nNormally symbiotic, Symbiodinium actually becomes toxic to corals at higher temperatures; the process on display in this video (called pulsed inflation) is a defense mechanism. It may protect them in the short term, but corals need this algae to recolonize quickly, because they rely on the sugar the algae produce for nourishment. If temperatures remain high over time, the Symbiodinium will not return, leaving the corals’ white skeletons exposed and the animals defenseless against diseases and other stressors.',
            image: '../../static/images/splash/coral_bleaching_up_close.png',
            imageSelected: '../../static/images/splash/coral_bleaching_up_close_active.png',
            widget: <iframe width="560" height="315" src="https://www.youtube.com/embed/bFdPmiwZzVE?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>
          }
        ]
      },
      {
        name: 'dead',
        label: 'Dead',
        image: 'https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/images/dead-optimized.jpg',
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
    const earthMode = props.url.query.earthMode;

    this.state = {
      skyLoading: false,
      panorama,
      selectedPanorama,
      showDragHelp: true,
      soundActivated: true,
      selectedHotspot: null,
      earthMode
    };
  }

  componentDidMount() {
    super.componentDidMount();

    const { selectedPanorama } = this.state;

    this.panoramaSky = document.getElementById('panorama-sky');
    this.panoramaSky.addEventListener('materialtextureloaded', this.handleImageLoaded);
    document.addEventListener('mousedown', this.hideDragHelp);

    selectedPanorama.hotspots.forEach((hotspot) => {
      const elem = document.getElementById(hotspot.id);
      elem.addEventListener('click', () => this.handleSelectedHostpot(hotspot));
    });
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
    document.removeEventListener('mousedown', this.hideDragHelp);
  }

  @Autobind
  handleSoundChange() {
    this.setState({
      soundActivated: !this.state.soundActivated
    });
  }

  handleSelectedHostpot(hotspot) {
    this.setState({ selectedHotspot: hotspot });
  }

  @Autobind
  handleCloseRightMenu() {
    this.setState({ selectedHotspot: null });
  }

  render() {
    const { selectedPanorama, skyLoading, panorama, showDragHelp, soundActivated, selectedHotspot, earthMode } = this.state;
    const skyImage = selectedPanorama && selectedPanorama.image;
    const intro = selectedPanorama && selectedPanorama.intro;
    const text = selectedPanorama && selectedPanorama.text;
    const hotspots = selectedPanorama && selectedPanorama.hotspots;
    const options = panorama && panorama.options;
    const backgroundSound = panorama.backgroundSound;

    console.log('intro', intro);

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
            <img className="logo" src="/static/images/logo-resource-watch.png" alt="Resource Watch" />
          </Link>
          <div className="links">
            <div className="earth-view-link">
              <Link route="splash">
                <img src="/static/images/splash/globe.svg" alt="Earth view" />
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
        {selectedHotspot &&
          <div className="right-section">
            <div
              className="arrow-button"
              role="button"
              tabIndex={-1}
              onClick={this.handleCloseRightMenu}
            >
              <img src="/static/images/splash/arrow-right.svg" alt="Close right menu" />
            </div>
            <div className="detail-container">
              <h2>{selectedHotspot.title}</h2>
              <div className="text-container">
                {selectedHotspot.text}
              </div>
              {selectedHotspot.widget}
            </div>
          </div>
        }
        <div className="panorama">
          <Spinner isLoading={skyLoading} className="-light" />
          <div className="menu-container">
            <div className="scenario-box">
              Scenario
            </div>
            <div className="menu">
              {options && options.map(elem => (
                <div className="option" key={elem.name}>
                  <input type="radio" id={elem.name} checked={selectedPanorama.name === elem.name} onChange={this.handlePanoramaChange} />
                  <label htmlFor={elem.name}>{elem.label}</label>
                </div>
              ))
              }
              <div className="option">
                <input type="checkbox" id="soundCheckbox" checked={soundActivated} onChange={this.handleSoundChange}/>
                <label htmlFor="soundCheckbox">Sound</label>
              </div>
            </div>
          </div>
          <a-scene
            cursor="rayOrigin: mouse"
            embedded
          >
            {options &&
              <a-assets>
                <img id="marker" src="../../static/images/splash/marker.svg" alt="" />
                <img id="markerSelected" src="../../static/images/splash/marker.svg" alt="" />
                {options && options.map(elem => (
                  <img key={elem.name} id={elem.name} src={elem.image} alt="" crossOrigin="anonymous" />
                ))
                }
              </a-assets>
            }

            { /* 360-degree image */ }
            {!earthMode &&
              <a-sky id="panorama-sky" src={skyImage} />
            }
            {earthMode &&
              <a-sky id="panorama-sky" src="../../static/images/splash/earthExperiment.jpg" />
            }


            { /* Background sound */ }
            {backgroundSound && soundActivated &&
              <audio
                src={backgroundSound}
                autoPlay
                loop
                preload
              >
                <track kind="captions" /> { /* TO-DO add captions for deaf users */ }
              </audio>
            }

            {intro && showDragHelp &&
              <a-entity
                id="intro"
                position="0 2 -10"
                geometry="primitive: plane; height: 10; width: 10"
                material={`shader: flat; src: ${intro}; transparent: true`}
              />
            }

            { /* Hotspots */ }
            {hotspots && hotspots.map(elem => (
              <a-entity
                id={elem.id}
                position={elem.position}
                key={elem.title}
                geometry="primitive: plane; height: 4; width: 6"
                material={`shader: flat; src: ${(selectedHotspot && selectedHotspot.id === elem.id) ? elem.imageSelected : elem.image}; transparent: true`}
              />
            ))}

            { /* Camera */ }
            <a-camera look-controls="reverseMouseDrag: true" />
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
