import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Progress from 'react-progress-2';

// Utils
import { initGA, logPageView } from 'utils/analytics';

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

class LayoutAdmin extends PureComponent {
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
    setLocale: PropTypes.func.isRequired
  };

  static defaultProps = { className: null };

  state = { modalOpen: false }

  UNSAFE_componentWillMount() {
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
      toggleModal,
      setModalOptions
    } = this.props;
    const { modalOpen } = this.state;
    const componentClass = classnames('l-page', { [className]: !!className });

    return (
      <div id="#main" className={componentClass}>
        <Head title={title} description={description} />

        <GDPRBanner />

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
      </div>
    );
  }
}

export default LayoutAdmin;
