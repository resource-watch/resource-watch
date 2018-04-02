import React from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { getFaqs } from 'redactions/admin/faqs';
import { Link } from 'routes';

// Components
import Page from 'layout/page';
import Layout from 'layout/layout/layout-app';
import Banner from 'components/app/common/Banner';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import FaqBlock from 'components/app/common/Faqs/FaqBlock';

class Faqs extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);

    // Get Faqs
    await context.store.dispatch(getFaqs());

    return { ...props };
  }

  render() {
    const { faqs } = this.props;
    const orderedFaqs = sortBy(faqs, faq => faq.order);

    return (
      <Layout
        title="FAQs"
        description="Faqs description"
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
                  <h1>FAQs</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="l-section">
          <div className="l-container">
            {orderedFaqs.map(faq =>
              (<div className="row align-center" key={faq.id}>
                <div className="column small-12 medium-8">
                  <FaqBlock item={faq} />
                </div>
              </div>)
            )}
          </div>
        </section>

        <aside className="l-postcontent">
          <div className="l-container">
            <div className="row align-center">
              <div className="column small-12">
                <Banner className="-text-center" bgImage={'/static/images/backgrounds/partners-02@2x.jpg'}>
                  <p className="-claim">
                    Questions, comments, or feedback? <br />
                    Help us improve Resource Watch.
                  </p>
                  <Link to="about_contact-us">
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

Faqs.propTypes = {
  faqs: PropTypes.array.isRequired,
  getFaqs: PropTypes.func
};

Faqs.defaultProps = {
  faqs: []
};

const mapStateToProps = state => ({ faqs: state.faqs.list });

const mapDispatchToProps = {
  getFaqs
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Faqs);
