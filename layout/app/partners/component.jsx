import Link from 'next/link';

// components
import Layout from 'layout/layout/layout-app';
import PartnerBlock from 'components/partner-block';
import Banner from 'components/app/common/Banner';
import Breadcrumbs from 'components/ui/Breadcrumbs';

// hooks
import {
  usePublishedPartners,
} from 'hooks/partners';

// constants
import {
  OCEAN_WATCH_EXCLUSIVE_PARTNER_TYPES,
} from 'constants/ocean-watch';

const EXCLUSIVE_PARTNERS = [
  'founding_partners',
  'funders',
  'anchor_funder',
];

export default function LayoutPartners() {
  const {
    data: partners,
  } = usePublishedPartners({}, {
    select: (_partners) => ({
      founders: _partners.filter((_partner) => _partner['partner-type'] === 'founding_partners'),
      funders: _partners.filter((_partner) => _partner['partner-type'] === 'funders'),
      anchorFunders: _partners.filter((_partner) => _partner['partner-type'] === 'anchor_funder'),
      others: _partners.filter((_partner) => !EXCLUSIVE_PARTNERS.includes(_partner['partner-type']) && !OCEAN_WATCH_EXCLUSIVE_PARTNER_TYPES.includes(_partner['partner-type'])),
    }),
    placeholderData: [],
    refetchOnWindowFocus: false,
  });

  return (
    <Layout
      title="Partners"
      // TO-DO: fill description
      description="Partners description"
      pageHeader
    >
      <div className="c-page-header">
        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              <div className="page-header-content">
                <Breadcrumbs items={[{ name: 'About', route: '/about' }]} />
                <h1>Partners</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="l-section -secondary">
        <header className="l-section-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <h2>Let’s build a more sustainable world together.</h2>
                <p>
                  We couldn’t do this on our own. Resource Watch is a global
                  partnership of public, private, and civil society organizations
                  convened by World Resources Institute to provide trusted and
                  timely data for a sustainable future.
                </p>
              </div>
            </div>
          </div>
        </header>
      </section>

      <section className="l-section">
        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              <h2 className="-text-center">Founding partners</h2>
            </div>
          </div>
          <div className="row">
            {partners && partners.founders.map((p) => (
              <div
                className="column small-12 medium-6"
                key={p.id}
              >
                <PartnerBlock item={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="l-section -secondary">
        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              <h2 className="-text-center">Anchor funders</h2>
            </div>
          </div>
          <div className="row">
            {partners && partners.anchorFunders.map((p) => (
              <div
                className="column small-12"
                key={p.id}
              >
                <PartnerBlock item={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="l-section">
        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              <h2 className="-text-center">Funders</h2>
            </div>
          </div>
          <div className="row">
            {partners && partners.funders.map((p) => (
              <div
                className="column small-12 medium-6"
                key={p.id}
              >
                <PartnerBlock item={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="l-section -secondary">
        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              <h2 className="-text-center">Data providers</h2>
              <p>
                The following data providers have been active in helping us access and
                interpret data that would otherwise not be available on Resource Watch.
                We also thank the many governments and institutions, not listed here,
                that have made their data widely open and accessible.
              </p>
            </div>
          </div>
          <div className="row">
            {partners && partners.others.map((p) => (
              <div
                className="column small-12 medium-6"
                key={p.id}
              >
                <PartnerBlock item={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="l-section">
        <div className="l-container">
          <div className="row align-center">
            <div className="column small-12 medium-8">
              <div className="c-terms">
                <h2 className="-text-center">About the partnership</h2>
                <p>Partners support Resource Watch by</p>
                <ul>
                  <li>
                    <strong>Providing technical resources</strong>
                    {' '}
                    such as
                    storage, computing, and technical expertise,
                  </li>
                  <li>
                    <strong>Contributing data and insights</strong>
                    {' '}
                    on what’s
                    happening around the world and how data can be used to drive action,
                  </li>
                  <li>
                    <strong>Guiding system design</strong>
                    {' '}
                    to ensure Resource Watch
                    is useful to a wide variety of users,
                  </li>
                  <li>
                    <strong>Supporting the use of Resource Watch</strong>
                    {' '}
                    in specific
                    communities who can utilize the data to advance a more sustainable future,
                  </li>
                  <li>
                    <strong>Building on Resource Watch</strong>
                    {' '}
                    to create custom products
                    and applications, and
                  </li>
                  <li>
                    <strong>Providing financial support</strong>
                    {' '}
                    to enable Resource Watch
                    to stay up to date and provide free information to people around the globe.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <aside className="l-postcontent">
        <div className="l-container">
          <div className="row align-center">
            <div className="column small-12">
              <Banner
                className="-text-center"
                bgImage="/static/images/backgrounds/partners-02@2x.jpg"
              >
                <p className="-claim">
                  Questions, comments, or feedback?
                  {' '}
                  <br />
                  Help us improve Resource Watch.
                </p>
                <Link
                  href="/about/contact-us"
                >
                  <a className="c-button -alt -primary">Contact us</a>
                </Link>
              </Banner>
            </div>
          </div>
        </div>
      </aside>
    </Layout>
  );
}
