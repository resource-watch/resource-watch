import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { getPartners } from 'redactions/admin/partners';

// Components
import Page from 'layout/page';
import Layout from 'layout/layout/layout-app';
import PartnerBlock from 'components/app/common/Partners/PartnerBlock';
import Banner from 'components/app/common/Banner';
import Breadcrumbs from 'components/ui/Breadcrumbs';


class Partners extends Page {
  componentDidMount() {
    this.props.getPartners();
  }

  render() {
    const founders = this.props.partners.filter(p => p.partner_type === 'founding_partners');
    const funders = this.props.partners.filter(p => p.partner_type === 'funders');
    const partners = this.props.partners.filter(p => p.partner_type !== 'funders' && p.partner_type !== 'founding_partners');

    return (
      <Layout
        title="Partners"
        description="Partners description"
        url={this.props.url}
        user={this.props.user}
        pageHeader
      >
        <div className="c-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <Breadcrumbs
                    items={[{ name: 'About', route: 'about' }]}
                  />
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
                    We couldn’t do this on our own. Resource Watch is a global partnership of public, private, and civil society organizations convened by World Resources Institute to provide trusted and timely data for a sustainable future.
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
              {founders.map(p =>
                (<div className="column small-12 medium-6" key={p.id}>
                  <PartnerBlock item={p} />
                </div>)
              )}
            </div>
          </div>
        </section>

        <section className="l-section -secondary">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <h2 className="-text-center">Funders</h2>
              </div>
            </div>
            <div className="row">
              {funders.map(p =>
                (<div className="column small-12 medium-6" key={p.id}>
                  <PartnerBlock item={p} />
                </div>)
              )}
            </div>
          </div>
        </section>

        <section className="l-section">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <h2 className="-text-center">Data providers</h2>
                <p>
                  The following data providers have been active in helping us access and interpret data that would otherwise not be available on Resource Watch. We also thank the many governments and institutions, not listed here, that have made their data widely open and accessible.
                </p>
              </div>
            </div>
            <div className="row">
              {partners.map(p =>
                (<div className="column small-12 medium-6" key={p.id}>
                  <PartnerBlock item={p} />
                </div>)
              )}
            </div>
          </div>
        </section>

        <aside>
          <div className="l-container">
            <div className="row align-center">
              <div className="column small-12 medium-8">
                <div className="c-terms">
              <h2 className="-text-center">About the partnership</h2>
              <p>Partners support Resource Watch by</p>
              <ul>
                <li>
                  <strong>Providing technical resources</strong> such as storage, computing, and technical expertise,
                </li>
                <li>
                  <strong>Contributing data and insights</strong> on what’s happening around the world and how data can be used to drive action,
                </li>
                <li>
                  <strong>Guiding system design</strong> to ensure Resource Watch is useful to a wide variety of users,
                </li>
                <li>
                  <strong>Supporting the use of Resource Watch</strong> in specific communities who can utilize the data to advance a more sustainable future,
                </li>
                <li>
                  <strong>Building on Resource Watch</strong> to create custom products and applications, and
                </li>
                <li>
                  <strong>Providing financial support</strong> to enable Resource Watch to stay up to date and provide free information to people around the globe.
                </li>
              </ul>
                </div>
              </div>
            </div>
          </div>
        </aside>
        <aside className="l-postcontent">
          <div className="l-container">
            <div className="row align-center">
              <div className="column small-12">
                <Banner className="-text-center" bgImage={'/static/images/backgrounds/partners-02@2x.jpg'}>
                  <p className="-claim">
                    Questions, comments, or feedback? <br />
                    Help us improve Resource Watch.
                  </p>
                  <Link to="/about/contact-us">
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
}

Partners.propTypes = {
  partners: PropTypes.array.isRequired,
  getPartners: PropTypes.func
};

Partners.defaultProps = {
  partners: []
};

const mapStateToProps = state => ({ partners: state.partners.list });

const mapDispatchToProps = {
  getPartners
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Partners);
