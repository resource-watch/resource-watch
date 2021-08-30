import { useState } from 'react';
import PropTypes from 'prop-types';

// components
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Icon from 'components/ui/icon';
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';

// utils
import { logEvent } from 'utils/analytics';

const Hero = ({ title, description }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="l-container">
        <div className="row">
          <div className="column small-12">
            <div
              style={{
                padding: '30px 0 0',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <Breadcrumbs
                  className="-dark"
                  items={[
                    {
                      name: 'Dashboards',
                      route: '/dashboards',
                    },
                  ]}
                />
                <div className="c-stack">
                  <button
                    type="button"
                    className="c-btn -tertiary -clean"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Icon name="icon-info" className="-small" />
                    <span>About</span>
                  </button>
                  <button
                    type="button"
                    className="c-btn -tertiary -clean"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Icon name="icon-share" className="-small" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
              <h1 className="page-header-title">{title}</h1>
              <h3 className="page-header-title -body-font-color" style={{ fontWeight: 'normal' }}>
                {description}
              </h3>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} className="-medium" onRequestClose={() => setIsModalOpen(false)}>
        <ShareModal
          links={{
            link: typeof window !== 'undefined' && window.location.href,
          }}
          analytics={{
            facebook: () => logEvent('Share', 'Share dashboard: Ocean Watch', 'Facebook'),
            twitter: () => logEvent('Share', 'Share dashboard: Ocean Watch', 'Twitter'),
            email: () => logEvent('Share', 'Share dashboard: Ocean Watch', 'Email'),
            copy: (type) => logEvent('Share', 'Share dashboard: Ocean Watch', `Copy ${type}`),
          }}
        />
      </Modal>
    </>
  );
};

Hero.defaultProps = {
  title: 'Land Watch',
  description: null,
};

Hero.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

export default Hero;
