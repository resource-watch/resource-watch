import {
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import Progress from 'react-progress-2';
import Toastr from 'react-redux-toastr';
import { useRouter } from 'next/router';
import { Icons } from 'vizzuality-components';

// utils
import { initGA, logPageView } from 'utils/analytics';
import { browserSupported } from 'utils/browser';

// components
import HeadApp from 'layout/head/app';
import Header from 'layout/header';
import Footer from 'layout/footer';
import UserReport from 'layout/user-report';
import Search from 'layout/header/search';
import IconsRW from 'components/icons';
import Modal from 'components/ui/Modal';
import NoBrowserSupport from 'components/app/common/Browser';
import GDPRBanner from 'components/ui/gdpr-banner';
import OceanWatchHero from './hero';

export default function LayoutOceanWatch({
  title,
  description,
  children,
  isExtendedHero,
}) {
  const router = useRouter();

  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      if (Progress && Progress.Component.instance) Progress.show();
    });

    router.events.on('routeChangeComplete', () => {
      if (Progress && Progress.Component.instance) Progress.hideAll();
    });

    // Google Analytics
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
  }, [router]);

  return (
    <div
      id="#main"
      className="l-ocean-watch"
    >
      <HeadApp
        title={title}
        description={description}
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

      <Progress.Component />

      {isExtendedHero && (
        <div className="hero-extended-background">
          <Header pageHeader />
          <OceanWatchHero className="-transparent" />
          {children}
        </div>
      )}

      {!isExtendedHero && (
        <>
          <Header className="-transparent" />
          <OceanWatchHero className="-ocean-watch" />
          {children}
        </>
      )}

      <Footer />

      <Search />

      <Toastr
        preventDuplicates
        transitionIn="fadeIn"
        transitionOut="fadeOut"
      />

      <UserReport />
    </div>
  );
}

LayoutOceanWatch.defaultProps = {
  title: 'Ocean Watch',
  description: null,
  isExtendedHero: false,
};

LayoutOceanWatch.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  isExtendedHero: PropTypes.bool,
};
