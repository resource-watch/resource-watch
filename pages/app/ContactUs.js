import React from 'react';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import Page from 'layout/page';
import Layout from 'layout/layout/layout-app';
import Banner from 'components/app/common/Banner';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import ContactUsForm from 'components/app/common/ContactUs/ContactUsForm';
import { Link } from 'routes';

class ContactUs extends Page {
  render() {
    return (
      <Layout
        title="Contact us"
        description="Contact us description"
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
                  <h1>Contact us</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="l-section">
          <div className="l-container">
            <div className="row align-center">
              <div className="column small-12 medium-8">
                <h2>
                  Questions, comments, or feedback?
                  Help us strengthen Resource Watch.
                </h2>
              </div>
            </div>
            <div className="row align-center">
              <div className="column small-12 medium-8 large-6">
                <ContactUsForm />
              </div>
            </div>
            <div className="row align-center">
              <div className="column small-12 medium-8">
                <h2>Media inquiries</h2>
                <p>Please contact Corey Filiault at <a href="mailto://corey.filiault@wri.org">corey.filiault@wri.org</a> or Lauren Zelin at <a href="mailto://lzelin@wri.org">lzelin@wri.org</a> for media inquiries.</p>
              </div>
            </div>
          </div>
        </section>

        <aside className="l-postcontent">
          <div className="l-container">
            <div className="row align-center">
              <div className="column small-12">
                <Banner className="-text-center" bgImage={'/static/images/backgrounds/partners-02@2x.jpg'}>
                  <p className="-claim">
                    Let&rsquo;s build a more sustainable<br /> world together.
                  </p>
                  <Link to="about_partners">
                    <a className="c-btn -primary">Partners</a>
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

export default withRedux(initStore)(ContactUs);
