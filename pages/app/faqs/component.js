import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import { Link } from 'routes';

// actions
import { getFaqs } from 'redactions/admin/faqs';

// components
import Layout from 'layout/layout/layout-app';
import Banner from 'components/app/common/Banner';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import FaqBlock from 'components/app/common/Faqs/FaqBlock';

class FaqsPage extends PureComponent {
  static propTypes = { faqs: PropTypes.array.isRequired };

  static async getInitialProps({ store }) {
    const { getState, dispatch } = store;
    const { faqs: { list } } = getState();

    if (!list.length) await dispatch(getFaqs());

    return {};
  }

  render() {
    const { faqs } = this.props;
    // TO-DO: move this from here
    const orderedFaqs = sortBy(faqs, faq => faq.order);

    return (
      <Layout
        title="FAQs"
        // TO-DO: fill description
        description="Faqs description"
        pageHeader
      >
        <div className="c-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <Breadcrumbs items={[{ name: 'About', route: 'about' }]} />
                  <h1>FAQs</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="l-section">
          <div className="l-container">
            {orderedFaqs.map(faq => (
              <div
                className="row align-center"
                key={faq.id}
              >
                <div className="column small-12 medium-8">
                  <FaqBlock item={faq} />
                </div>
              </div>))}
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

export default FaqsPage;
