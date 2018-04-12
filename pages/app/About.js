import React from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';

import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { bindActionCreators } from 'redux';
import { getStaticData } from 'redactions/static_pages';

import { Link } from 'routes';
import Page from 'layout/page';
import Layout from 'layout/layout/layout-app';
import Banner from 'components/app/common/Banner';
import CardApp from 'components/app/common/CardApp';

class About extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);

    // Get static data
    await context.store.dispatch(getStaticData('about'));

    return { ...props };
  }

  componentDidMount() {
    if (!this.props.isServer) this.props.getStaticData('about');
  }

  render() {
    const { data } = this.props;

    if (!data) return null;

    const styles = {};
    if (data && data.photo) {
      styles.backgroundImage = `url(${process.env.STATIC_SERVER_URL}${data.photo.cover})`;
    }

    const userCards = [
      {
        id: 'government-staff',
        title: 'Government Staff',
        description: 'Use dashboards and alerts to monitor the conditions of the environment and its relevance to citizens.  Find reliable data to inform policies to advance your agenda.',
      },
      {
        id: 'business-analysts',
        title: 'Business Analysts',
        description: 'Track and visualize business risks and opportunities across your global operations for multiple issues or pull data into your own systems for analysis.',
      },
      {
        id: 'journalists',
        title: 'Journalists',
        description: 'Find out what’s happening in the world right now and access trustworthy data to discover new insights and inform stories.',
      },
      {
        id: 'researchers',
        title: 'Researchers',
        description: 'Find robust data for your analysis or share your own data and insights with others who can act on them.',
      },
      {
        id: 'citizens',
        title: 'Citizens',
        description: 'Understand the issues affecting your community, identify sustainable options, and share your findings to inspire action and hold decision-makers accountable.',
      },
      {
        id: 'more',
        title: 'More',
        description: 'Learn what you can do with Resource Watch.',
        link: {
          route: '/about/howto',
          label: 'Learn more',
          className: '-primary',
          external: false
        }
      }
    ];

    const valuesCards = [
      {
        id: 'reliability',
        title: 'Reliability',
        description: 'Resource Watch data are curated by World Resources Institute’s independent, nonpartisan experts, drawing from the best peer-reviewed and authoritative sources on the issues that matter the most. Learn more about our data curation process.',
        link: {
          label: 'Data policy',
          route: '/get-involved/data-policy',
          className: '-primary'
        }
      },
      {
        id: 'openness',
        title: 'Openness',
        description: 'We are committed to making information accessible and usable. Whenever possible, our data are made publicly available under open licenses, and the Resource Watch platform is open source for others to use and build upon.',
        link: {
          label: 'Visit our Github',
          route: 'https://github.com/resource-watch',
          className: '-primary',
          external: true
        }
      },
      {
        id: 'community',
        title: 'Community',
        description: 'A sustainable future is only possible when we work together. Resource Watch is a global partnership of public, private, and civil society organizations, supported by a growing community of users, including you. Learn more about how you can help.',
        link: {
          label: 'Get involved',
          route: '/get-involved',
          className: '-primary'
        }
      }
    ];

    return (
      <Layout
        title="About"
        description="About description..."
        url={this.props.url}
        user={this.props.user}
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
              {userCards.map(card => (
                <div key={card.id} className="column small-12 medium-6 large-4 c-card-column">
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
              {valuesCards.map(card => (
                <div key={card.id} className="column small-12 medium-6 large-4 c-card-column">
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
                  Resource Watch is hosted and convened by the World Resources Institute (WRI). Financial support for Resource Watch comes from a generous anchor grant from DOB Ecology and a start-up grant from The Tilia Fund. Resource Watch has supporting grants from Skoll Global Threats Fund and Bloomberg Philanthropies, as well as institutional grants to the World Resources Institute from the Ministry of Foreign Affairs of the Netherlands, the Royal Danish Ministry of Foreign Affairs, and the Swedish International Development Cooperation Agency.
                </p>
                <p>
                  Resource Watch would not be possible without the generous contributions of our partners.
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

About.propTypes = {
  url: PropTypes.object,
  isServer: PropTypes.bool,
  data: PropTypes.object,
  getStaticData: PropTypes.func
};

const mapStateToProps = state => ({
  data: state.staticPages.about
});

const mapDispatchToProps = dispatch => ({
  getStaticData: bindActionCreators(slug => getStaticData(slug), dispatch)
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(About);
