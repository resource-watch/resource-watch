import { useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import classnames from 'classnames';

// components
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Icon from 'components/ui/icon';
import Tabs from 'components/ui/Tabs';
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';

// constants
const OCEAN_WATCH_TABS = [
  {
    label: 'Introduction',
    value: '/dashboards/ocean-watch',
    route: '/dashboards/ocean-watch',
    params: {},
  },
  {
    label: 'Coastal Profile',
    value: '/dashboards/ocean-watch/country',
    route: '/dashboards/ocean-watch/country',
    params: {},
  },
  {
    label: 'About Ocean Watch',
    value: '/dashboards/ocean-watch/about',
    route: '/dashboards/ocean-watch/about',
    params: {},
  },
  {
    label: 'Partners',
    value: '/dashboards/ocean-watch/partners',
    route: '/dashboards/ocean-watch/partners',
    params: {},
  },
];

export default function OceanWatchHero({ className }) {
  const { pathname } = useRouter();
  const [shareVisible, setShareVisibility] = useState(false);

  return (
    <section className={classnames('l-page-header', { [className]: !!className })}>
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
                  items={[
                    {
                      name: 'Dashboards',
                      route: '/dashboards',
                    },
                  ]}
                />
                <button
                  type="button"
                  className="c-btn -tertiary -alt -clean"
                  onClick={() => setShareVisibility(true)}
                >
                  <Icon name="icon-share" className="-small" />
                  <span>Share</span>
                </button>
              </div>
              <h1 className="mb-2 page-header-title md:mb-8">
                Ocean Watch <sup>Beta</sup>
              </h1>
              <Tabs
                options={OCEAN_WATCH_TABS}
                defaultSelected={pathname}
                selected={pathname}
                className="overflow-x-auto"
              />
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={shareVisible}
        className="-medium"
        onRequestClose={() => setShareVisibility(false)}
      >
        <ShareModal
          links={{
            link: typeof window !== 'undefined' && window.location.href,
          }}
        />
      </Modal>
    </section>
  );
}

OceanWatchHero.defaultProps = {
  className: null,
};

OceanWatchHero.propTypes = {
  className: PropTypes.string,
};
