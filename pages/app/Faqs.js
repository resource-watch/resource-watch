import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { getFaqs } from 'redactions/admin/faqs';

// Components
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import Banner from 'components/app/common/Banner';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import FaqBlock from 'components/app/common/Faqs/FaqBlock';

class Faqs extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);

    // Dashboard detail
    await context.store.dispatch(getFaqs());

    return { ...props };
  }

  render() {
    const { faqs } = this.props;

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
            <div className="page-header-content">
              <Breadcrumbs
                items={[{ name: 'About', route: 'about' }]}
              />
              <h1>FAQs</h1>
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
                    Resource Watch connects leading technology companies and
                    data providers dedicated to broadening access to timely,
                    relevant natural resource information. This powerful
                    partnership brings together trusted data sets from remote
                    sensing systems, peer-reviewed research, and other
                    reputable sources, making new data streams actionable for
                    the first time. Open-access web and mobile apps deliver
                    insights and information to decision-makers and passionate
                    citizens working to make a difference.
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
                <h2 className="-text-center">FAQs</h2>
              </div>
            </div>

            {faqs.map(faq =>
              (<div className="row">
                <div className="column small-12" key={faq.id}>
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
