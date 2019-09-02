import React from 'react';
import { Link } from 'routes';

// components
import Layout from 'layout/layout/layout-app';
import Banner from 'components/app/common/Banner';
import Breadcrumbs from 'components/ui/Breadcrumbs';

// styles
import './styles.scss';

const LayoutNewsletter = () => (
  <Layout
    title="Newsletter"
    description="Sign up for Resource Watch news"
    className="l-newsletter-thank-you"
    pageHeader
  >
    <div className="c-page-header">
      <div className="l-container">
        <div className="row">
          <div className="column small-12">
            <div className="page-header-content">
              <Breadcrumbs items={[{ name: 'About', route: 'about' }]} />
              <h1>Newsletter</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
    <section className="l-section">
      <div className="l-container">
        <div className="row align-center">
          <div className="column small-12 medium-8">
            <h2>Thank you!</h2>
            <p>
              Thank you for letting us know you still want to hear from Resource Watch. <br />
              <br />
              You may wish to read our <a href="/privacy-policy">privacy policy</a>, which provides
              further information about how we use personal data.
            </p>
            <div className="image-container">
              {/* <img src="/static/images/pages/app/thankyou.jpg" alt="" /> */}
            </div>
            <div className="c-button-container -j-between">
              <Link to="myrw" params={{ tab: 'areas' }}>
                <a className="c-btn -secondary">Check my subscriptions</a>
              </Link>
              <Link to="explore">
                <a className="c-btn -primary 'compressed">Go to Explore</a>
              </Link>
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
                Let&rsquo;s build a more sustainable
                <br /> world together.
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

export default LayoutNewsletter;
