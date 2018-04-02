/* eslint max-len: 0 */
import React from 'react';
import classnames from 'classnames';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { toggleModal, setModalOptions } from 'redactions/modal';
import { toastr } from 'react-redux-toastr';

// Responsive
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';

// Layout
import Page from 'layout/page';
import Head from 'layout/head/app';
import Icons from 'layout/icons';
import Header from 'components/splash/layout/Header';

// Components
import Spinner from 'components/ui/Spinner';
import Modal from 'components/ui/Modal';
import Icon from 'components/ui/Icon';
import { Link } from 'routes';
import Title from 'components/ui/Title';

// Utils
import { PANORAMAS } from 'utils/splash/Panoramas';

class SplashDetail extends Page {
  constructor(props) {
    super(props);
    const panorama = PANORAMAS.find(p => p.name === props.url.query.id);
    const selectedPanorama = panorama.options.find(e => e.name === panorama.default);
    const earthMode = props.url.query.earthMode;

    this.state = {
      skyLoading: true,
      panorama,
      selectedPanorama,
      soundActivated: false,
      selectedHotspot: null,
      earthMode,
      mouseHovering: false,
      modalOpen: false,
      introOpened: true,
      copied: { }
    };

    // --------------- Bindings -----------------------
    this.handlePanoramaChange = this.handlePanoramaChange.bind(this);
    this.handleImageLoaded = this.handleImageLoaded.bind(this);
    this.handleSoundChange = this.handleSoundChange.bind(this);
    this.handleCloseRightMenu = this.handleCloseRightMenu.bind(this);
    this.handleToggleIntro = this.handleToggleIntro.bind(this);
    // ------------------------------------------------
  }

  componentDidMount() {
    if (this.props.responsive.fakeWidth < breakpoints.medium) return;

    this.panoramaSky = document.getElementById('panorama-sky');
    if (this.panoramaSky) {
      this.panoramaSky.addEventListener('materialtextureloaded', this.handleImageLoaded);
    }

    this.addEventListenersToHotspots();
  }

  componentWillReceiveProps(newProps) {
    if (this.state.modalOpen !== newProps.modal.open) {
      this.setState({ modalOpen: newProps.modal.open });
    }
  }

  addEventListenersToHotspots() {
    const { selectedPanorama } = this.state;

    if (selectedPanorama.hotspots) {
      selectedPanorama.hotspots.forEach((hotspot) => {
        const elem = document.getElementById(hotspot.id);
        elem.addEventListener('click', () => this.handleSelectedHostpot(hotspot));
        elem.addEventListener('mouseenter', () => this.handleMouseOverHotspot(hotspot));
        elem.addEventListener('mouseleave', () => this.handleMouseLeavesHotspot(hotspot));
      });
    }
  }

  /**
  * UI Event handlers
  * - handlePanoramaChange
  * - handleImageLoaded
  * - handleSoundChange
  * - handleSelectedHostpot
  * - handleMouseOverHotspot
  * - handleMouseLeavesHotspot
  * - handleCloseRightMenu
  */
  handlePanoramaChange(event) {
    const { panorama } = this.state;
    const radioButtonId = event.target.getAttribute('id');
    this.setState({
      selectedPanorama: panorama.options.find(e => e.name === radioButtonId),
      skyLoading: true,
      introOpened: true
    }, () => this.addEventListenersToHotspots());
  }

  handleImageLoaded() {
    this.setState({ skyLoading: false });
  }

  handleSoundChange() {
    this.setState({
      soundActivated: !this.state.soundActivated
    });
  }

  handleSelectedHostpot(hotspot) {
    this.setState({ selectedHotspot: hotspot });
  }
  handleMouseOverHotspot() {
    this.setState({ mouseHovering: true });
  }
  handleMouseLeavesHotspot() {
    this.setState({ mouseHovering: false });
  }

  handleCloseRightMenu() {
    this.setState({ selectedHotspot: null });
  }

  handleToggleIntro() {
    this.setState({ introOpened: !this.state.introOpened });
  }

  /**
   * - onCopyClick
   * @param  {string} type
   * @return
   */
  onCopyClick = (type) => {
    try {
      document.execCommand('copy');

      this.setState({
        copied: {
          ...this.state.copied,
          [type]: true
        }
      });

      setTimeout(() => {
        this.setState({
          copied: {
            ...this.state.copied,
            [type]: false
          }
        });
      }, 1000);
    } catch (err) {
      toastr.warning('Oops, unable to copy');
    }
  }

  render() {
    const { modal, responsive } = this.props;
    const {
      selectedPanorama,
      skyLoading,
      panorama,
      soundActivated,
      selectedHotspot,
      earthMode,
      mouseHovering,
      introOpened
    } = this.state;
    const skyImage = selectedPanorama && selectedPanorama.image;
    const hotspots = selectedPanorama && selectedPanorama.hotspots;
    const options = panorama && panorama.options;
    const { backgroundSound } = panorama;
    const hasIntro = selectedPanorama && selectedPanorama.intro;

    const pageClass = classnames({
      'p-splash-detail': true,
      '-hovering': mouseHovering
    });

    return (
      <div>
        {/* Mobile Splash details page */}
        <MediaQuery
          maxDeviceWidth={breakpoints.medium - 1}
          values={{ deviceWidth: responsive.fakeWidth }}
        >
          <div
            title="Resource Watch"
            className={`${pageClass} --mobile`}
          >
            <Head
              title="SplashDetail page"
              description="SplashDetail page description"
            />
            <div className="c-splash-header">
              <Link route="home">
                <img className="logo" src="/static/images/logo-resource-watch.png" alt="Resource Watch" />
              </Link>
            </div>

            <div className="c-card-app -compact">
              <div className="card-container">
                <Title className="-default">Check it on desktop</Title>
                <div className="card-content">
                  This page is best experienced on desktop.
                </div>

                <a
                  className="c-btn -secondary -compressed"
                  tabIndex={0}
                  role="button"
                  onClick={() => this.onCopyClick('link')}
                  onKeyDown={() => this.onCopyClick('link')}
                >
                  {this.state.copied.link ? 'Copied' : 'Copy link'}
                </a>

                <div className="card-footer">
                  <Link
                    route="splash"
                  >
                    <a className="c-button -secondary -fullwidth">
                      Earth view
                    </a>
                  </Link>
                  <Link
                    route="home"
                  >
                    <a className="c-button -primary -fullwidth">
                      Go to Resource Watch
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </MediaQuery>

        {/* Desktop Splash details page */}
        <MediaQuery
          minDeviceWidth={breakpoints.medium}
          values={{ deviceWidth: responsive.fakeWidth }}
        >

          <div
            title="Resource Watch"
            className={pageClass}
          >
            <Head
              title="SplashDetail page"
              description="SplashDetail page description"
            />
            <Icons />
            <Header
              hideSkip
              showEarthViewLink
            />
            {hasIntro &&
              <div className={classnames('intro-container', `-${introOpened ? 'opened' : 'closed'}`)}>
                <div className={classnames('text-container', `-${introOpened ? 'opened' : 'closed'}`)}>
                  {selectedPanorama.intro}
                </div>
                <button
                  type="button"
                  className={classnames('l-sidebar-toggle', 'btn-toggle', `-${introOpened ? 'opened' : ''}`)}
                  onClick={this.handleToggleIntro}
                >
                  <Icon
                    className={classnames('-little', `-${introOpened ? 'left' : 'right'}`)}
                    name={`icon-arrow-${introOpened ? 'left' : 'right'}`}
                  />
                </button>
              </div>
            }
            {selectedHotspot &&
              <div className="hotspot-section">
                <div
                  className="selected-hotspot-container"
                  role="button"
                  tabIndex={-1}
                  onClick={this.handleCloseRightMenu}
                >
                  <img src={selectedHotspot.imageSelected} alt={selectedHotspot.title} />
                </div>
                <div className="detail-container">
                  { /* Hide this to make more room for the text <h2>{selectedHotspot.title}</h2> */}
                  <div className="text-container">
                    <div className="markup-container">
                      {selectedHotspot.markup}
                    </div>
                  </div>
                </div>
                <div
                  className="close-button-container"
                  role="button"
                  tabIndex={-1}
                  onClick={this.handleCloseRightMenu}
                >
                  <div className="close-button">
                    <img src="/static/images/splash/close-modal.svg" alt="Close" />
                    Close
                  </div>
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
                      <label htmlFor={elem.name}>
                        {elem.label}
                      </label>
                    </div>
                    ))
                  }
                  <div className="option">
                    <input type="checkbox" id="soundCheckbox" checked={soundActivated} onChange={this.handleSoundChange} />
                    <label htmlFor="soundCheckbox">
                      Sound
                    </label>
                  </div>
                </div>
              </div>
              <a-scene
                cursor="rayOrigin: mouse"
                embedded
                vr-mode-ui="enabled: false"
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
                  <a-sky id="panorama-sky" src={skyImage} color="#CACCD0" />
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

                { /* Hotspots */ }
                {hotspots && hotspots.map((elem) => {
                  const width = elem.imageWidth / 100 * 1.2;
                  const height = elem.imageHeight / 100 * 1.2;
                  const geometrySt = `primitive: plane; height: ${height}; width: ${width}`;
                  return (<a-entity
                    id={elem.id}
                    position={elem.position}
                    rotation={elem.rotation}
                    key={elem.title}
                    geometry={geometrySt}
                    material={`shader: flat; src: ${(selectedHotspot && selectedHotspot.id === elem.id) ? elem.imageSelected : elem.image}; transparent: true`}
                  />);
                })}

                { /* Camera */ }
                <a-camera look-controls="reverseMouseDrag: true" />
              </a-scene>
            </div>
            <Modal
              open={this.state.modalOpen}
              options={modal.options}
              className="no-borders"
              loading={modal.loading}
              toggleModal={this.props.toggleModal}
              setModalOptions={this.props.setModalOptions}
            />
          </div>
        </MediaQuery>

      </div>
    );
  }
}

const mapStateToProps = state => ({
  modal: state.modal,
  responsive: state.responsive
});

const mapDispatchToProps = {
  toggleModal,
  setModalOptions
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(SplashDetail);
