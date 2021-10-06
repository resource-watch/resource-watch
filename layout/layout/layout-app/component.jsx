import { Component } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';
import Progress from 'react-progress-2';
import classnames from 'classnames';

// Utils
import { initGA, logPageView } from 'utils/analytics';
import { browserSupported } from 'utils/browser';

// vizzuality-components
import { Icons } from 'vizzuality-components';

// Components
import HeadApp from 'layout/head/app';
import Header from 'layout/header';
import Footer from 'layout/footer';

import IconsRW from 'components/icons';
import Tooltip from 'components/ui/Tooltip';
import Modal from 'components/ui/Modal';
import Toastr from 'react-redux-toastr';
import Search from 'layout/header/search';
import NoBrowserSupport from 'components/app/common/Browser';
import GDPRBanner from 'components/ui/gdpr-banner';

// utils
import { containsString } from 'utils/string';

// constants
import { FULLSCREEN_PAGES } from 'constants/app';

const UserReportButton = dynamic(() => import('../../user-report'), { ssr: false });

class LayoutApp extends Component {
  constructor(props) {
    super(props);

    this.state = { modalOpen: false };
  }

  componentDidMount() {
    const {
      router,
      updateIsLoading,
    } = this.props;

    router.events.on('routeChangeStart', () => {
      updateIsLoading(true);
      if (Progress && Progress.Component.instance) Progress.show();
    });

    router.events.on('routeChangeComplete', () => {
      updateIsLoading(false);
      if (Progress && Progress.Component.instance) Progress.hideAll();
    });

    // Google Analytics
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(newProps) {
    const {
      modalOpen,
    } = this.state;
    if (modalOpen !== newProps.modal.open) {
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
      children,
      toggleModal,
      setModalOptions,
      router: {
        pathname,
      },
    } = this.props;
    const { modalOpen } = this.state;
    const componentClass = classnames(
      'l-page',
      { [className]: !!className },
    );

    const isFullScreen = containsString(pathname, FULLSCREEN_PAGES);

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

        {!browserSupported()
          && (
          <Modal
            open
            canClose={false}
          >
            <NoBrowserSupport />
          </Modal>
          )}

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

        <UserReportButton />
      </div>
    );
  }
}

LayoutApp.defaultProps = {
  title: null,
  description: null,
  className: null,
  pageHeader: false,
  thumbnail: 'https://resourcewatch.org/static/images/social-big.jpg',
};

LayoutApp.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  pageHeader: PropTypes.bool,
  className: PropTypes.string,
  modal: PropTypes.shape({
    options: PropTypes.shape({}),
    loading: PropTypes.bool,
  }).isRequired,
  thumbnail: PropTypes.string,
  toggleModal: PropTypes.func.isRequired,
  setModalOptions: PropTypes.func.isRequired,
  updateIsLoading: PropTypes.func.isRequired,
  router: PropTypes.shape({
    events: PropTypes.shape({
      on: PropTypes.func.isRequired,
    }),
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default withRouter(LayoutApp);
