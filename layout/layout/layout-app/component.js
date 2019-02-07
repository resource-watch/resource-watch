import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Progress from 'react-progress-2';
import classnames from 'classnames';

// Utils
import { initGA, logPageView } from 'utils/analytics';
import { browserSupported } from 'utils/browser';

// Wri-api-components
import { Icons } from 'wri-api-components';

// Components
import { Router } from 'routes';
import HeadApp from 'layout/head/app';
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

// constants
import {
  FULLSCREEN_PAGES,
  USERREPORT_BLACKLIST
} from 'constants/app';

class LayoutApp extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    routes: PropTypes.object.isRequired,
    pageHeader: PropTypes.bool,
    className: PropTypes.string,
    category: PropTypes.string,
    modal: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    thumbnail: PropTypes.string,
    toggleModal: PropTypes.func.isRequired,
    setModalOptions: PropTypes.func.isRequired,
    updateIsLoading: PropTypes.func.isRequired
  };

  static defaultProps = {
    title: null,
    description: null,
    className: null,
    category: null,
    pageHeader: false,
    thumbnail: 'https://resourcewatch.org/static/images/social-big.jpg'
  }

  state = { modalOpen: false }

  componentWillMount() {
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

    // if (window.Transifex) {
    //   window.Transifex.live.onReady(() => {
    //     window.Transifex.live.onTranslatePage((locale) => {
    //       this.props.setLocale(locale);
    //       window.location.reload();
    //     });
    //   });
    // }

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
      title,
      description,
      routes: { pathname },
      pageHeader,
      modal,
      className,
      category,
      thumbnail
    } = this.props;
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
          category={category}
        />

        {!browserSupported() &&
          <Modal
            open
            canClose={false}
          >
            <NoBrowserSupport />
          </Modal>
        }

        <Icons />

        <Header pageHeader={pageHeader} />

        <Progress.Component />

        {this.props.children}

        {!FULLSCREEN_PAGES.includes(pathname) && <Footer />}

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

        {!USERREPORT_BLACKLIST.includes(pathname) && <UserReport />}

        {/* widget editor */}
        <WidgetModal />
        <WidgetTooltip />
        <WidgetIcons />
      </div>
    );
  }
}

export default LayoutApp;
