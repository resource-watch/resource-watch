/* eslint max-len: 0 */
import React from 'react';
import { Link } from 'routes';
import { Autobind } from 'es-decorators';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { getInsights } from 'redactions/insights';

// Layout
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';

// Components
import Banner from 'components/app/common/Banner';
import CardStatic from 'components/app/common/CardStatic';
import Rating from 'components/app/common/Rating';

const exploreCards = [
  {
    tag: 'Explore Data',
    title: 'Dive into the data',
    intro: 'Create and download custom visualisations using our collection of datasets related to natural resources.',
    buttons: [
      {
        text: 'Explore data',
        path: 'explore',
        className: '-primary'
      }
    ],
    background: 'url(/static/tempImages/backgrounds/explore_data_1.png)'
  },
  {
    tag: 'Dashboards',
    title: 'Review the topic or country you care about most',
    intro: 'Find facts and figures about a country or topic, or build your own dashboard to monitor the data you care about.',
    buttons: [
      {
        text: 'View dashboards',
        path: 'dashboards',
        className: '-primary'
      }
    ],
    background: 'url(/static/tempImages/backgrounds/explore_data_2.png)'
  },
  {
    tag: 'Planet Pulse',
    title: 'Take the pulse of our planet',
    intro: 'A global snapshot of key impacts on livelihoods from the latest data.',
    buttons: [
      {
        text: 'Launch Planet Pulse',
        path: '/data/pulse',
        anchor: true,
        className: '-primary'
      }
    ],
    background: 'url(/static/tempImages/backgrounds/planetpulse.jpg) 67% center'
  }
];

class Home extends Page {
  static insightsCardsStatic(insightsData) {
    return insightsData.map(c =>
      (<CardStatic
        key={`insight-card-${c.tag}`}
        className="-alt"
        background={c.background}
        clickable
        route={`/blog/${c.slug}`}
      >
        <div>
          <h4>{c.tag}</h4>
          <h3>
            <Link route={`/blog/${c.slug}`}>
              <a>{c.title}</a>
            </Link>
          </h3>
        </div>
        <div className="footer">
          <div className="source">
            <img src={c.source.img || ''} alt={c.slug} />
            <div className="source-name">
              by <a href={c.source.path} target="_blank">{c.source.name}</a>
            </div>
          </div>
          {c.ranking && <Rating rating={c.ranking} />}
        </div>
      </CardStatic>)
    );
  }

  static exploreCardsStatic() {
    return exploreCards.map(c =>
      (<div key={`explore-card-${c.title}`} className="column small-12 medium-4">
        <CardStatic
          className="-alt"
          background={c.background}
          clickable
          route={c.buttons[0].path}
          anchor={c.buttons[0].anchor}
        >
          <div>
            <h4>{c.tag}</h4>
            <h3>{c.title}</h3>
            <p>{c.intro}</p>
          </div>
          <div className="buttons -align-center">
            {c.buttons.map((b) => {
              if (b.anchor) {
                return (
                  <a href={b.path} key={b.path} className={`c-btn -alt ${b.className}`}>{b.text}</a>
                );
              }
              return (
                <Link route={b.path} key={b.path}><a className={`c-btn -alt ${b.className}`}>{b.text}</a></Link>
              );
            })}
          </div>
        </CardStatic>
      </div>)
    );
  }

  componentDidMount() {

    this.props.getInsights();
  }

  render() {
    const { insights } = this.props;
    const insightsCardsStatic = Home.insightsCardsStatic(insights);
    const exploreCardsStatic = Home.exploreCardsStatic();

    return (
      <Layout
        title="Resource Watch"
        description="Resource Watch description"
        url={this.props.url}
        user={this.props.user}
        className="page-home"
      >
        <div className="video-intro">
          <div className="video-foreground">
            <iframe
              id="video-intro"
              title="Video Intro"
              frameBorder="0"
              allowFullScreen
              // Loop parameter has limited support in the AS3 player and in IFrame embeds, which could load either the AS3 or HTML5 player.
              // Currently, the loop parameter only works in the AS3 player when used in conjunction with the playlist parameter.
              // To loop a single video, set the loop parameter value to 1 and set the playlist parameter value to the same video ID already specified in the Player API URL
              src="https://youtube.com/embed/XryMlA-8IwE?controls=0&showinfo=0&rel=0&autoplay=1&loop=1&playlist=XryMlA-8IwE"
            />
          </div>
          <div className="video-text">
            <div>
              <h1>Explore a world <br />of natural resource data</h1>
              <p>Discover the latest data, make connections, and help create a more sustainable planet.</p>
            </div>
          </div>
        </div>

        <section id="discoverIsights" className="l-section">
          <div className="l-container">
            <header>
              <div className="row">
                <div className="column small-12 medium-8">
                  <h2>Discover Signals</h2>
                  <p>Read the stories behind the data on our Signals blog.</p>
                </div>
              </div>
            </header>

            <div className="insight-cards">
              <div className="row">
                <div className="column small-12 medium-8">
                  {insightsCardsStatic[0]}
                </div>
                <div className="column small-12 medium-4">
                  <div className="dual">
                    {insightsCardsStatic[1]}
                    {insightsCardsStatic[2]}
                  </div>
                </div>
              </div>
            </div>

            <div className="buttons -text-center">
              <div className="row">
                <div className="column small-12 medium-12">
                  <Link route="insights">
                    <a className="c-btn -primary">More Signals</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="l-section -secondary">
          <div className="l-container">
            <header>
              <div className="row">
                <div className="column small-12 medium-8">
                  <h2>Explore the data</h2>
                  <p>Discover data, create visualizations, and subscribe to updates on key datasets.</p>
                </div>
              </div>
            </header>

            <div className="explore-cards">
              <div className="row">
                {exploreCardsStatic}
              </div>
            </div>
          </div>
        </section>

        <Banner className="get-involved" bgImage={'/static/images/backgrounds/mod_getInvolved.jpg'}>
          <div className="l-container">
            <div className="l-row row">
              <div className="column small-12 medium-6">
                <h2>Get involved</h2>
                <p>
                  We{'’'}ve brought together the best datasets related to natural resources,
                  so you can find new insights, influence decisions and change the world.
                  There{'’'}s a world of opportunity to take this futher. Here are
                  some ideas to get you started.
                </p>
              </div>
            </div>
            <div className="buttons">
              <div className="l-row row">
                <div className="column small-12 medium-3">
                  <Link route="get_involved_detail" params={{ id: 'contribute-data', source: 'home' }}><a className="c-btn -b -alt -fullwidth">Contribute data</a></Link>
                </div>
                <div className="column small-12 medium-3">
                  <Link route="get_involved_detail" params={{ id: 'join-community', source: 'home' }}><a className="c-btn -b -alt -fullwidth">Join the community</a></Link>
                </div>
                <div className="column small-12 medium-3">
                  <Link route="get_involved_detail" params={{ id: 'submit-an-insight', source: 'home' }}><a className="c-btn -b -alt -fullwidth">Submit a story</a></Link>
                </div>
                <div className="column small-12 medium-3">
                  <Link route="get_involved_detail" params={{ id: 'develop-app', source: 'home' }}><a className="c-btn -b -alt -fullwidth">Develop your app</a></Link>
                </div>
              </div>
            </div>
          </div>
        </Banner>

      </Layout>
    );
  }
}

const mapStateToProps = state => ({ insights: state.insights.list });

const mapDispatchToProps = dispatch => ({
  getInsights: () => dispatch(getInsights())
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Home);
