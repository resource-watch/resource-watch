import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Progress from 'react-progress-2';

// Utils
import { initGA, logPageView } from 'utils/analytics';
import { getGDPRAccepted } from 'utils/gdpr';

// Components
import { Router } from 'routes';
import IconsRW from 'components/icons';

// vizzuality-components
import { Icons } from 'vizzuality-components';

import Head from 'layout/head/admin';
import Header from 'layout/header-admin';

import Tooltip from 'components/ui/Tooltip';
import Modal from 'components/ui/Modal';
import Toastr from 'react-redux-toastr';
import Search from 'layout/header/search';
import GDPRBanner from 'components/ui/gdpr-banner';

import {
  setConfig,
  Modal as WidgetModal,
  Tooltip as WidgetTooltip,
  Icons as WidgetIcons
} from 'widget-editor';

class LayoutAdmin extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    pageHeader: PropTypes.bool,
    className: PropTypes.string,
    modal: PropTypes.object.isRequired,
    toggleModal: PropTypes.func.isRequired,
    toggleTooltip: PropTypes.func.isRequired,
    setModalOptions: PropTypes.func.isRequired,
    updateIsLoading: PropTypes.func.isRequired,
    setLocale: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
  };

  static defaultProps = { className: null };

  constructor(props) {
    super(props);
    this.state = { modalOpen: false, gdprAccepted: false };

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

  componentWillMount() {
    // When a tooltip is shown and the router navigates to a
    // another page, the tooltip stays in place because it is
    // managed in Redux
    // The way we prevent this is by listening to the router
    // and whenever we navigate, we hide the tooltip
    // NOTE: we can't just call this.props.toggleTooltip here
    // because for some pages, we don't re-mount the LayoutAdmin
    // component. If we listen for events from the router,
    // we're sure to not miss any page.
    this.props.toggleTooltip(false);
  }

  componentDidMount() {
    Router.onRouteChangeStart = () => {
      if (Progress && Progress.Component.instance) Progress.show();
      this.props.toggleTooltip(false);
      this.props.updateIsLoading(true);
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

  handleAcceptGDPR = () => {
    this.setState({ gdprAccepted: false });
  };

  render() {
    const {
      title,
      description,
      pageHeader,
      modal,
      className,
      toggleModal,
      setModalOptions
    } = this.props;
    const { gdprAccepted, modalOpen } = this.state;
    const componentClass = classnames('l-page', { [className]: !!className });

    const showGDPRBanner = !gdprAccepted && !getGDPRAccepted();

    return (
      <div id="#main" className={componentClass}>
        <Head title={title} description={description} />

        {showGDPRBanner && <GDPRBanner onAccept={this.handleAcceptGDPR} />}

        <Icons />
        <IconsRW />

        <Progress.Component />

        <Header pageHeader={pageHeader} />

        {this.props.children}

        <Tooltip />

        <Search />

        <Modal
          open={modalOpen}
          options={modal.options}
          loading={modal.loading}
          toggleModal={toggleModal}
          setModalOptions={setModalOptions}
        />

        <Toastr preventDuplicates transitionIn="fadeIn" transitionOut="fadeOut" />

        {/* Widget editor */}
        <WidgetModal />
        <WidgetTooltip />
        <WidgetIcons />
      </div>
    );
  }
}

export default LayoutAdmin;
