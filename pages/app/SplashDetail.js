/* eslint max-len: 0 */
import React from 'react';
import { Link } from 'routes';
import classnames from 'classnames';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { toggleModal } from 'redactions/modal';
import { setUser } from 'redactions/user';
import { setRouter } from 'redactions/routes';

// Layout
import Page from 'components/app/layout/Page';
import Head from 'components/app/layout/head';
import Header from 'components/splash/layout/Header';

// Components
import Spinner from 'components/ui/Spinner';
import SplashDetailModal from 'components/modal/SplashDetailModal';
import Modal from 'components/ui/Modal';

// Utils
import { PANORAMAS } from 'utils/splash/Panoramas';

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
      soundActivated: true,
      selectedHotspot: null,
      earthMode,
      mouseHovering: false,
      modalOpen: false
    };

    // --------------- Bindings -----------------------
    this.handlePanoramaChange = this.handlePanoramaChange.bind(this);
    this.handleImageLoaded = this.handleImageLoaded.bind(this);
    this.handleSoundChange = this.handleSoundChange.bind(this);
    this.handleCloseRightMenu = this.handleCloseRightMenu.bind(this);
    // ------------------------------------------------
  }

  componentDidMount() {
    const { selectedPanorama } = this.state;

    this.panoramaSky = document.getElementById('panorama-sky');
    this.panoramaSky.addEventListener('materialtextureloaded', this.handleImageLoaded);

    selectedPanorama.hotspots.forEach((hotspot) => {
      const elem = document.getElementById(hotspot.id);
      elem.addEventListener('click', () => this.handleSelectedHostpot(hotspot));
      elem.addEventListener('mouseenter', () => this.handleMouseOverHotspot(hotspot));
      elem.addEventListener('mouseleave', () => this.handleMouseLeavesHotspot(hotspot))
    });

    const options = {
      children: SplashDetailModal,
      childrenProps: {
        markup: selectedPanorama.intro,
        className: 'no-borders'
      }
    };
    this.props.toggleModal(true, options);
  }

  componentWillReceiveProps(newProps) {
    if (this.state.modalOpen !== newProps.modal.open) {
      this.setState({ modalOpen: newProps.modal.open });
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
      skyLoading: true
    });
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
  handleMouseOverHotspot(hotspot) {
    this.setState({ mouseHovering: true });
  }
  handleMouseLeavesHotspot(hotspot) {
    this.setState({ mouseHovering: false });
  }

  handleCloseRightMenu() {
    this.setState({ selectedHotspot: null });
  }

  render() {
    const { modal } = this.props;
    const {
      selectedPanorama,
      skyLoading,
      panorama,
      soundActivated,
      selectedHotspot,
      earthMode,
      mouseHovering
    } = this.state;
    const skyImage = selectedPanorama && selectedPanorama.image;
    const intro = selectedPanorama && selectedPanorama.intro;
    const markup = selectedPanorama && selectedPanorama.markup;
    const hotspots = selectedPanorama && selectedPanorama.hotspots;
    const options = panorama && panorama.options;
    const backgroundSound = panorama.backgroundSound;

    const pageClass = classnames({
      'p-splash-detail': true,
      '-hovering': mouseHovering
    });

    return (
      <div
        title="Resource Watch"
        className={pageClass}
      >
        <Head
          title="SplashDetail page"
          description="SplashDetail page description"
        />
        <Header
          showEarthViewLink={true}
        />
        {selectedHotspot &&
          <div className="hotspot-section">
            <div className="detail-container">
              <h2>{selectedHotspot.title}</h2>
              <div className="text-container">
                {selectedHotspot.markup}
              </div>
            </div>
            <div className="close-button-container">
              <div
                className="close-button"
                role="button"
                tabIndex={-1}
                onClick={this.handleCloseRightMenu}
              >
                <img src="/static/images/splash/close-modal.svg" />
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

            { /* Hotspots */ }
            {hotspots && hotspots.map(elem => (
              <a-entity
                id={elem.id}
                position={elem.position}
                rotation={elem.rotation}
                key={elem.title}
                geometry="primitive: plane; height: 4; width: 6"
                material={`shader: flat; src: ${(selectedHotspot && selectedHotspot.id === elem.id) ? elem.imageSelected : elem.image}; transparent: true`}
              />
            ))}

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
    );
  }
}

const mapStateToProps = state => ({
  modal: state.modal
});

const mapDispatchToProps = {
  toggleModal,
  setModalOptions
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(SplashDetail);
