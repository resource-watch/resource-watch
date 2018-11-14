import React from 'react';
import PropTypes from 'prop-types';
import Progress from 'react-progress-2';

// Utils
import { initGA, logPageView } from 'utils/analytics';
import { browserSupported } from 'utils/browser';

// Wri-api-components
import { Icons } from 'wri-api-components';

// Components
import { Router } from 'routes';
import Head from 'layout/head/app';
import Header from 'layout/header';
import Footer from 'layout/footer';
import UserReport from 'layout/user-report';

import Tooltip from 'components/ui/Tooltip';
import Modal from 'components/ui/Modal';
import Toastr from 'react-redux-toastr';
import Search from 'layout/header/search';

import NoBrowserSupport from 'components/app/common/Browser';

import {
  setConfig,
  Modal as WidgetModal,
  Tooltip as WidgetTooltip,
  Icons as WidgetIcons
} from 'widget-editor';

const fullScreenPages = [
  '/app/explore',
  '/app/pulse',
  '/app/Splash',
  '/app/log-in'
];

class LayoutApp extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    routes: PropTypes.object,
    pageHeader: PropTypes.bool,
    className: PropTypes.string,
    category: PropTypes.string,
    // Store
    modal: PropTypes.object.isRequired,
    toggleModal: PropTypes.func.isRequired,
    setModalOptions: PropTypes.func.isRequired,
    updateIsLoading: PropTypes.func.isRequired,
    setLocale: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false
    };

    // WIDGET EDITOR
    // Change the configuration according to your needs
    setConfig({
      url: process.env.WRI_API_URL,
      env: 'production,preproduction',
      applications: process.env.APPLICATIONS,
      authUrl: process.env.CONTROL_TOWER_URL,
      assetsPath: '/static/images/widget-editor/',
      userToken: props.user.token2,
      userEmail: props.user.email
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

    if (window.Transifex) {
      window.Transifex.live.onReady(() => {
        window.Transifex.live.onTranslatePage((locale) => {
          this.props.setLocale(locale);
          window.location.reload();
        });
      });
    }

    // Google Analytics
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
  }

  componentWillReceiveProps(newProps) {
    if (this.state.modalOpen !== newProps.modal.open) {
      this.setState({ modalOpen: newProps.modal.open });
    }
  }

  render() {
    const {
      title, description, routes, pageHeader, modal, className, category
    } = this.props;

    const fullScreen = routes.pathname && fullScreenPages.indexOf(routes.pathname) !== -1;

    return (
      <div id="#main" className={`l-page ${className}`}>
        <Head
          title={title}
          description={description}
          category={category}
        />


        {!browserSupported() &&
          <Modal open canClose={false}>
            <NoBrowserSupport />
          </Modal>
        }

        <Icons />

        <Header
          pageHeader={pageHeader}
        />

        <Progress.Component />

        {this.props.children}

        {!fullScreen && <Footer />}

        <Tooltip />

        <Search />

        <Modal
          open={this.state.modalOpen}
          options={modal.options}
          loading={modal.loading}
          toggleModal={this.props.toggleModal}
          setModalOptions={this.props.setModalOptions}
        />

        <Toastr
          preventDuplicates
          transitionIn="fadeIn"
          transitionOut="fadeOut"
        />

        <UserReport />

        {/* Widget editor */}
        <WidgetModal />
        <WidgetTooltip />
        <WidgetIcons />
      </div>
    );
  }
}

export default LayoutApp;
