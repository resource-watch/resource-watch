import React from 'react';
import PropTypes from 'prop-types';
import Progress from 'react-progress-2';

// Utils
import { initGA, logPageView } from 'utils/analytics';

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

import {
  setConfig,
  Modal as WidgetModal,
  Tooltip as WidgetTooltip,
  Icons as WidgetIcons
} from 'widget-editor';

const fullScreenPages = [
  '/app/Explore',
  '/app/Pulse',
  '/app/Splash'
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
    toggleTooltip: PropTypes.func.isRequired,
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
    // because for some pages, we don't re-mount the LayoutApp
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

        <Icons />


        <Header
          pageHeader={pageHeader}
        />

        <Progress.Component />

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

        {/* Widget editor */}
        <WidgetModal />
        <WidgetTooltip />
        <WidgetIcons />
      </div>
    );
  }
}

export default LayoutApp;
