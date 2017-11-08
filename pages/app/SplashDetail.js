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
          <Link route="home">
            <a>GO TO RESOURCE WATCH</a>
          </Link>
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
