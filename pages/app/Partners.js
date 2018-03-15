import React from 'react';
import PropTypes from 'prop-types';

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
                  <p className="-columnize">
                    Resource Watch connects leading technology companies and data providers dedicated to broadening access to timely, relevant natural resource information. This powerful partnership brings together trusted data sets from remote sensing systems, peer-reviewed research, and other reputable sources, making new data streams actionable for the first time. Open-access web and mobile apps deliver insights and information to decision-makers and passionate citizens working to make a difference.
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

        <section className="l-section -secondary">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <h2 className="-text-center">Partners</h2>
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

        <aside className="l-postcontent">
          <div className="l-container">
            <div className="row align-center">
              <div className="column small-12">
                <Banner className="-text-center" bgImage={'/static/images/backgrounds/partners-02@2x.jpg'}>
                  <p className="-claim">
                    See yourself as part<br /> of this team?
                  </p>
                  <button className="c-btn -primary -alt">
                    Get in touch
                  </button>
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
