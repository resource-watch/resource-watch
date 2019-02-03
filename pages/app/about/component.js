import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';
import { Link } from 'routes';

// actions
import { getStaticData } from 'redactions/static_pages';

// components
// import Page from 'layout/page';
import Layout from 'layout/layout/layout-app';
import Banner from 'components/app/common/Banner';
import CardApp from 'components/app/common/CardApp';

// constants
import { USER_CARDS, VALUES_CARDS } from './constants';

class AboutPage extends PureComponent {
  static propTypes = { data: PropTypes.object.isRequired }

  static async getInitialProps({ store }) {
    console.log(' --- ABOUT PAGE --- ');
    console.log(store);

    // fetchs data for about page
    const data = await store.dispatch(getStaticData('about'));

    return { data };
  }

  render() {
    const { data } = this.props;

    if (!data) return null;

    const styles = {};
    if (data && data.photo) {
      styles.backgroundImage = `url(${process.env.STATIC_SERVER_URL}${data.photo.cover})`;
    }

    return (
      <Layout
        title="About"
        // TO-DO: fill description
        description="About description..."
        className="l-static p-about"
      >
        <section className="l-content">
          <header className="l-content-header">
            <div className="cover" style={styles}>
              <div className="row">
                <div className="column small-12">
                  <div className="content">
                    <h1>{data.title}</h1>
                    <p>{data.summary}</p>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <article className="l-content-body">
            <div className="l-container">
              <div className="row align-center">
                <div className="column small-12 medium-8">
                  {renderHTML(data.content || '')}
                </div>
              </div>
            </div>
          </article>
        </section>

        <article className="l-section -secondary">
          <div className="l-container">
            <div className="row align-center">
              <div className="column small-12 medium-8">
                <h2 className="-text-center">What can I do with Resource Watch?</h2>
              </div>
            </div>
            <div className="row">
              {USER_CARDS.map(card => (
                <div
                  key={card.id}
                  className="column small-12 medium-6 large-4 c-card-column"
                >
                  <CardApp
                    title={card.title}
                    className="-compact"
                    description={card.description}
                    link={card.link}
                    buttonType="secondary"
                  />
                </div>))}
            </div>
          </div>
        </article>

        <article className="l-section">
          <div className="l-container">
            <div className="row align-center">
              <div className="column small-12">
                <h2 className="-text-center">Our values</h2>
              </div>
            </div>
            <div className="row align-center">
              {VALUES_CARDS.map(card => (
                <div
                  key={card.id}
                  className="column small-12 medium-6 large-4 c-card-column"
                >
                  <CardApp
                    title={card.title}
                    className="-compact"
                    description={card.description}
                    link={{ ...card.link }}
                    buttonType="primary"
                  />
                </div>))}
            </div>
          </div>
        </article>

        <article className="l-section -secondary">
          <div className="l-container">
            <div className="row align-center">
              <div className="column small-12 medium-8">
                <h2 className="-text-center">Our supporters</h2>
                <p>
                  Resource Watch is hosted and convened by the World Resources Institute (WRI).
                  Financial support for Resource Watch comes from a generous anchor grant from
                  DOB Ecology and a start-up grant from The Tilia Fund. Resource Watch
                  has supporting grants from Skoll Global Threats Fund and
                  Bloomberg Philanthropies, as well as institutional grants to the
                  World Resources Institute from the Ministry of Foreign Affairs
                  of the Netherlands, the Royal Danish Ministry of Foreign Affairs, and the
                  Swedish International Development Cooperation Agency.
                </p>
                <p>
                  Resource Watch would not be possible without the generous
                  contributions of our partners.
                </p>
                <div className="-text-center">
                  <Link to="about_partners">
                    <a className="c-button -primary">Partners</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>

        <aside className="l-postcontent">
          <div className="l-container">
            <div className="row align-center">
              <div className="column small-12">
                <Banner className="-text-center" bgImage="/static/images/backgrounds/partners-02@2x.jpg">
                  <p className="-claim">
                    Questions, comments, or feedback? <br />
                    Help us strengthen Resource Watch.
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

export default AboutPage;
