import { FC, useEffect, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import classnames from 'classnames';
import { Icons } from 'vizzuality-components';

// utils
import { initGA, logPageView } from 'utils/analytics';
import { browserSupported } from 'utils/browser';

// components
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
import ProgressBar from 'components/progress-bar';

const SurveyPrompt = dynamic(() => import('../../../components/survey-prompt'), { ssr: false });
const UserReportButton = dynamic(() => import('../../user-report'), { ssr: false });

export interface LayoutAppProps {
  children: ReactNode;
  className?: string;
  description?: string;
  isFullScreen?: boolean;
  title?: string;
  pageHeader?: boolean;
  thumbnail?: string;
  toggleModal?: () => void;
  // ! these properties are not typed as they will be removed in the future
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setModalOptions?: (options: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modal?: any;
}

const LayoutApp: FC<LayoutAppProps> = ({
  children,
  className = null,
  description,
  isFullScreen = false,
  modal,
  pageHeader = false,
  setModalOptions,
  thumbnail = 'https://resourcewatch.org/static/images/social-big.jpg',
  title,
  toggleModal,
}: LayoutAppProps) => {
  useEffect(() => {
    // Google Analytics
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
  }, []);

  return (
    <div className={classnames('l-page', { [className]: !!className })}>
      <HeadApp title={title} description={description} {...(thumbnail && { thumbnail })} />

      <GDPRBanner />

      {!browserSupported() && (
        <Modal open canClose={false}>
          <NoBrowserSupport />
        </Modal>
      )}

      <Icons />
      <IconsRW />

      <Header pageHeader={pageHeader} />

      <ProgressBar />

      <main>{children}</main>

      {!isFullScreen && <Footer />}

      <Tooltip />

      <Search />

      <SurveyPrompt />

      <Modal
        open={modal.open}
        options={modal.options}
        loading={modal.loading}
        toggleModal={toggleModal}
        setModalOptions={setModalOptions}
      />

      <Toastr preventDuplicates transitionIn="fadeIn" transitionOut="fadeOut" />

      <UserReportButton />
    </div>
  );
};

export default LayoutApp;
