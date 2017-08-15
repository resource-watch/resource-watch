import React from 'react';
import MoveTo from 'moveto';
import { Link } from 'routes';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Layout
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';

// Components
import Banner from 'components/app/common/Banner';
import CardStatic from 'components/app/common/CardStatic';
import Rating from 'components/app/common/Rating';

const insightsCards = [
  {
    tag: 'Insight of the week',
    title: 'A factory is being built in your neighborhood. Can you do anything about it?',
    slug: 'interactive-edi',
    source: { name: 'World Resources Institute', path: '#', img: 'https://vizzuality.github.io/WRW-Prototype/img/avatar-wri.png' },
    background: 'url(/static/tempImages/backgrounds/discovery_insights_image.jpg) center'
  },
  {
    tag: 'Feb 25, 2017',
    title: 'The Water Guardians of the Andes',
    slug: 'slideshow-peru',
    source: { name: 'ESPA', path: '#', img: '../static/images/avatars/espa_avatar.png' },
    background: 'url(/static/tempImages/backgrounds/andes.jpg) center'
  },
  {
    tag: 'Mar 5, 2017',
    title: 'Farms to feel squeeze as competition for water increases',
    slug: 'interactive-map',
    source: { name: 'World Resources Institute', path: '#', img: 'https://vizzuality.github.io/WRW-Prototype/img/avatar-wri.png' },
    background: 'url(/static/tempImages/backgrounds/world_farms.jpg)'
  }
];

const exploreCards = [
  {
    tag: 'Explore data',
    title: 'Dive into the data',
    intro: 'Create and download custom visualisations using our collection of over 180 datasets related to natural resources.',
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
        text: 'Launch planet pulse',
        path: 'pulse',
        className: '-primary'
      }
    ],
    background: 'url(/static/tempImages/backgrounds/planetpulse.jpg) 67% center'
  }
];

class Home extends Page {
  componentDidMount() {
    super.componentDidMount();
    Home.setAnchorScroll('discoverIsights', 'js-scroll');
  }

  static setAnchorScroll(target, trigger) {
    const triggerEl = document.getElementsByClassName(trigger)[0];
    const moveTo = new MoveTo({
      tolerance: 0,
      duration: 800,
      easing: 'easeOutQuart'
    });

    moveTo.registerTrigger(triggerEl);
  }

  static insightsCardsStatic() {
    return insightsCards.map(c =>
      (<CardStatic
        key={`insight-card-${c.tag}`}
        className="-alt"
        background={c.background}
        clickable
        route={c.source.path}
      >
        <div>
          <h4>{c.tag}</h4>
          <h3>
            <Link route={`/insights/${c.slug}`}>
              <a>{c.title}</a>
            </Link>
          </h3>
        </div>
        <div className="footer">
          <div className="source">
            <img src={c.source.img || ''} alt={c.slug} />
            <div className="source-name">
              by <a href={c.source.path}>{c.source.name}</a>
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
        >
          <div>
            <h4>{c.tag}</h4>
            <h3>{c.title}</h3>
            <p>{c.intro}</p>
          </div>
          <div className="buttons -align-center">
            {c.buttons.map(b => (
              <Link route={b.path} key={b.path}><a className={`c-btn -alt ${b.className}`}>{b.text}</a></Link>
            ))}
          </div>
        </CardStatic>
      </div>)
    );
  }

  render() {
    const exploreCardsStatic = Home.exploreCardsStatic();
    const insightsCardsStatic = Home.insightsCardsStatic();

    // <a className="scroll-icon js-scroll" href="#discoverIsights">
    //   <Icon name="icon-arrow-down" />
    // </a>

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
              src="https://youtube.com/embed/LI1RrCnnkDA?controls=0&showinfo=0&rel=0&autoplay=1&loop=1&playlist=LI1RrCnnkDA"
            />
          </div>
          <div className="video-text">
            <div>
              <h1>Quick and easy access <br />to a world of resource data</h1>
              <p>Explore the latest data, make insights, and help build a more sustainable planet</p>
            </div>
          </div>
        </div>

        <section id="discoverIsights" className="l-section">
          <div className="l-container">
            <header>
              <div className="row">
                <div className="column small-12 medium-8">
                  <h2>Discover Insights</h2>
                  <p>Read the latest analysis from our community or submit your own original story.</p>
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
                  <a href="/insights" className="c-btn -primary">More insights</a>
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
                  <p>Explore, create visualizations, receive updates and contribute with your data.</p>
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
          <div className="l-row row">
            <div className="column small-12 medium-6">
              <h2>Get Involved</h2>
              <p>
                We{'´'}ve brought together the best datasets related to natural resources,
                so you can find new insights, influence decisions and change the world.
                There{'´'}s a world of opportunity to take this futher. Here are
                some ideas to get you started.
              </p>
            </div>
          </div>
          <div className="buttons">
            <div className="l-row row">
              <div className="column small-12 medium-3">
                <Link route="get_involved_detail" params={{ id: 'contribute-data' }}><a className="c-btn -b -alt -fullwidth">Contribute data</a></Link>
              </div>
              <div className="column small-12 medium-3">
                <Link route="get_involved_detail" params={{ id: 'join-community' }}><a className="c-btn -b -alt -fullwidth">Join the community</a></Link>
              </div>
              <div className="column small-12 medium-3">
                <Link route="get_involved_detail" params={{ id: 'submit-an-insight' }}><a className="c-btn -b -alt -fullwidth">Submit an insight</a></Link>
              </div>
              <div className="column small-12 medium-3">
                <Link route="get_involved_detail" params={{ id: 'develop-app' }}><a className="c-btn -b -alt -fullwidth">Develop your app</a></Link>
              </div>
            </div>
          </div>
        </Banner>

      </Layout>
    );
  }
}

export default withRedux(initStore, null, null)(Home);
