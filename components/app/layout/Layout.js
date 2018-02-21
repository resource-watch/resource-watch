import React from 'react';
import PropTypes from 'prop-types';
import Progress from 'react-progress-2';

// Utils
import { initGA, logPageView } from 'utils/analytics';

// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleModal, setModalOptions } from 'redactions/modal';
import { toggleTooltip } from 'redactions/tooltip';
import { updateIsLoading } from 'redactions/page';
import { setLocale } from 'redactions/common';

// Components
import { Router } from 'routes';
import Head from 'components/layout/head/app';
import Header from 'components/layout/header';
import Icons from 'components/layout/icons';
import Footer from 'components/layout/footer';

import Tooltip from 'components/ui/Tooltip';
import Modal from 'components/ui/Modal';
import Toastr from 'react-redux-toastr';
import Dock from 'components/ui/Dock';
import Search from 'components/layout/header/search';

import { setConfig,
  Modal as WidgetModal,
  Tooltip as WidgetTooltip,
  Icons as WidgetIcons } from 'widget-editor';

const fullScreenPages = [
  '/app/Explore',
  '/app/Pulse',
  '/app/Splash'
];

class Layout extends React.Component {
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
      authUrl: process.env.CONTROL_TOWER_URL, // is this the correct one????
      assetsPath: '/static/images/widget-editor/',
      userToken: props.user.token,
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
    // because for some pages, we don't re-mount the Layout
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
          location.reload();
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
      title, description, url, pageHeader, modal, className, category
    } = this.props;
    const fullScreen = url.pathname && fullScreenPages.indexOf(url.pathname) !== -1;

    return (
      <div id="#main" className={`l-page ${className}`}>
        <Head
          title={title}
          description={description}
          category={category}
        />

        <Icons />

        <Progress.Component />

        <Header
          pageHeader={pageHeader}
        />

        {this.props.children}

        {!fullScreen && <Footer />}

        <Tooltip />

        <Dock />

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

        <link rel="stylesheet" media="screen" href="/static/styles/add-search-results.css" />

        <WidgetModal />
        <WidgetTooltip />
        <WidgetIcons />
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  url: PropTypes.object,
  pageHeader: PropTypes.bool,
  className: PropTypes.string,
  // Store
  modal: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired,
  toggleTooltip: PropTypes.func.isRequired,
  setModalOptions: PropTypes.func.isRequired,
  updateIsLoading: PropTypes.func.isRequired,
  setLocale: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  modal: state.modal,
  isLoading: state.page.isLoading,
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  toggleTooltip: () => dispatch(toggleTooltip()),
  toggleModal: open => dispatch(toggleModal(open, {}, true)),
  setModalOptions: options => dispatch(setModalOptions(options)),
  updateIsLoading: bindActionCreators(isLoading => updateIsLoading(isLoading), dispatch),
  setLocale: locale => dispatch(setLocale(locale))
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
