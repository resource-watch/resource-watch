import { PureComponent } from 'react';
import Link from 'next/link';

// components
import Layout from 'layout/layout/layout-app';
import Banner from 'components/app/common/Banner';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import ContactUsForm from 'components/app/common/ContactUs/ContactUsForm';

class LayoutContactUs extends PureComponent {
  render() {
    return (
      <Layout
        title="Contact us"
        // TO-DO: fill description
        description="Contact us description"
        className="l-contact-us"
        pageHeader
      >
        <div className="c-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <Breadcrumbs
                    items={[{ name: 'About', route: '/about' }]}
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
                <p>
                  Please contact Sergio Baldit at
                  {' '}
                  <a href="mailto:sergio.baldit@wri.org">sergio.baldit@wri.org</a>
                  {' '}
                  for media inquiries.
                </p>
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
                    Let&rsquo;s build a more sustainable
                    <br />
                    {' '}
                    world together.
                  </p>
                  <Link href="/about/partners">
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

export default LayoutContactUs;
