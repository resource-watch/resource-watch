import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Progress from 'react-progress-2';
import classnames from 'classnames';

// Utils
import { initGA, logPageView } from 'utils/analytics';
import { browserSupported } from 'utils/browser';

// vizzuality-components
import { Icons } from 'vizzuality-components';

// Components
import { Router } from 'routes';
import HeadApp from 'layout/head/app';
import Header from 'layout/header';
import Footer from 'layout/footer';

import UserReport from 'layout/user-report';
import IconsRW from 'components/icons';
import Tooltip from 'components/ui/Tooltip';
import Modal from 'components/ui/Modal';
import Toastr from 'react-redux-toastr';
import Search from 'layout/header/search';
import NoBrowserSupport from 'components/app/common/Browser';
import GDPRBanner from 'components/ui/gdpr-banner';

import {
  setConfig,
  Modal as WidgetModal,
  Tooltip as WidgetTooltip,
  Icons as WidgetIcons
} from 'widget-editor';

class LayoutApp extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    pageHeader: PropTypes.bool,
    className: PropTypes.string,
    modal: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    thumbnail: PropTypes.string,
    isFullScreen: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    setModalOptions: PropTypes.func.isRequired,
    updateIsLoading: PropTypes.func.isRequired
  };

  static defaultProps = {
    title: null,
    description: null,
    className: null,
    pageHeader: false,
    thumbnail: 'https://resourcewatch.org/static/images/social-big.jpg'
  }

  state = { modalOpen: false }

  UNSAFE_componentWillMount() {
    const { user: { token2, email } } = this.props;

    // WIDGET EDITOR – change the configuration according to your needs
    setConfig({
      url: process.env.WRI_API_URL,
      env: 'production,preproduction',
      applications: process.env.APPLICATIONS,
      authUrl: process.env.CONTROL_TOWER_URL,
      assetsPath: '/static/images/widget-editor/',
      userToken: token2,
      userEmail: email
    });
  }

  componentDidMount() {
    Router.onRouteChangeStart = () => {
      this.props.updateIsLoading(true);
      if (Progress && Progress.Component.instance) Progress.show();
    };
    Router.onRouteChangeComplete = () => {
      this.props.updateIsLoading(false);
      if (Progress && Progress.Component.instance) Progress.hideAll();
    };

    // Google Analytics
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (this.state.modalOpen !== newProps.modal.open) {
      this.setState({ modalOpen: newProps.modal.open });
    }
  }

  render() {
    const {
      title,
      description,
      pageHeader,
      modal,
      className,
      thumbnail,
      isFullScreen,
      children,
      toggleModal,
      setModalOptions
    } = this.props;
    const { modalOpen } = this.state;
    const componentClass = classnames(
      'l-page',
      { [className]: !!className }
    );

    return (
      <div
        id="#main"
        className={componentClass}
      >
        <HeadApp
          title={title}
          description={description}
          {...thumbnail && { thumbnail }}
        />

        <GDPRBanner />

        {!browserSupported() &&
          <Modal
            open
            canClose={false}
          >
            <NoBrowserSupport />
          </Modal>
        }

        <Icons />
        <IconsRW />

        <Header pageHeader={pageHeader} />

        <Progress.Component />

        {children}

        {!isFullScreen && (<Footer />)}

        <Tooltip />

        <Search />

        <Modal
          open={modalOpen}
          options={modal.options}
          loading={modal.loading}
          toggleModal={toggleModal}
          setModalOptions={setModalOptions}
        />

        <Toastr
          preventDuplicates
          transitionIn="fadeIn"
          transitionOut="fadeOut"
        />

        <UserReport />

        {/* widget editor */}
        <WidgetModal />
        <WidgetTooltip />
        <WidgetIcons />
      </div>
    );
  }
}

export default LayoutApp;
