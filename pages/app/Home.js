import React from 'react';
import { Link } from 'routes';
import Banner from 'components/app/common/Banner';
import CardStatic from 'components/app/common/CardStatic';
import Rating from 'components/app/common/Rating';
import Icon from 'components/ui/Icon';
import Page from 'components/app/layout/Page';
import MoveTo from 'moveto';

const insightsCards = [
  {
    tag: 'INSIGHT OF THE WEEK',
    title: 'A factory is being built in your neighborhood. Can you do anything about it?',
    slug: 'interactive-edi',
    source: { name: 'World Resources Institute', path: '#', img: 'https://vizzuality.github.io/WRW-Prototype/img/avatar-wri.png' },
    background: 'url(static/tempImages/backgrounds/discovery_insights_image.jpg) center'
  },
  {
    tag: 'Feb 25, 2017',
    title: 'The Water Guardians of the Andes',
    slug: 'slideshow-peru',
    source: { name: 'ESPA', path: '#', img: '../static/images/avatars/espa_avatar.png' },
    background: 'url(static/tempImages/backgrounds/andes.jpg) center'
  },
  {
    tag: 'Mar 5, 2017',
    title: 'Farms to feel squeeze as competition for water increases',
    slug: 'interactive-map',
    source: { name: 'World Resources Institute', path: '#', img: 'https://vizzuality.github.io/WRW-Prototype/img/avatar-wri.png' },
    background: 'url(static/tempImages/backgrounds/world_farms.jpg)'
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
    background: 'url(static/tempImages/backgrounds/explore_data_1.png)'
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
    background: 'url(static/tempImages/backgrounds/explore_data_2.png)'
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
    background: 'url(static/tempImages/backgrounds/planetpulse.jpg) 67% center'
  }
];

class Home extends React.Component {
  componentDidMount() {
    this.setAnchorScroll('discoverIsights', 'js-scroll');
  }

  setAnchorScroll(target, trigger) {
    const triggerEl = document.getElementsByClassName(trigger)[0];
    const moveTo = new MoveTo({
      tolerance: 0,
      duration: 800,
      easing: 'easeOutQuart'
    });

    moveTo.registerTrigger(triggerEl);
  }

  exploreCardsStatic() {
    return exploreCards.map((c, i) =>
      <div key={i} className="column small-12 medium-4">
        <CardStatic className="-light" background={c.background}>
          <div>
            <h5 className="tag c-text -small -bold -uppercase">{c.tag}</h5>
            <h1 className="card-title c-text -extra-big -bold">{c.title}</h1>
            <p className="c-text -big">{c.intro}</p>
          </div>
          <div className="buttons">
            {c.buttons.map((b, j) => (
              <button key={j} className={`c-btn ${b.className}`}>
                <Link route={b.path}><a>{b.text}</a></Link>
              </button>
            ))}
          </div>
        </CardStatic>
      </div>
    );
  }

  insightsCardsStatic() {
    return insightsCards.map((c, i) =>
      <CardStatic key={i} className="-light" background={c.background}>
        <div>
          <h5 className="tag c-text -small -bold -uppercase">{c.tag}</h5>
          <h1 className="card-title c-text -extra-big -bold"><a href={`/insights/${c.slug}`}>{c.title}</a></h1>
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
      </CardStatic>
    );
  }

  render() {
    const exploreCardsStatic = this.exploreCardsStatic();
    const insightsCardsStatic = this.insightsCardsStatic();

    return (
      <Page
        title="Resource Watch"
        description="Resource Watch description"
      >
        <div className="p-home">
          <div className="c-page">
            <Banner className="intro" containerGrid={false}>
              <h1 className="title c-text -header-huge -thin">
                Quick and easy access <br />to a world of resource data
              </h1>
              <p className="c-text -huge -thin">
                Explore the latest data, make insights, and help build a more sustainable planet
              </p>
              <a className="scroll-icon js-scroll" href="#discoverIsights">
                <Icon name="icon-arrow-down" />
              </a>
            </Banner>
            <section id="discoverIsights" className="l-section insights">
              <div className="l-container">
                <header className="row">
                  <div className="column small-12 medium-8">
                    <h1 className="title c-text -header-huge -primary -thin">Discover Insights</h1>
                  </div>
                </header>

                <div className="row">
                  <article className="column small-12 medium-5">
                    <p className="intro c-text -extra-big">
                      Read the latest analysis from our community or submit your own original story.
                    </p>
                  </article>
                </div>

                <div className="row insight-cards">
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
                <div className="row buttons">
                  <div className="column small-12 medium-4 medium-offset-4">
                    <a href="/insights" className="c-btn -filled -primary">More insights</a>
                  </div>
                </div>
              </div>
            </section>


            <section className="l-section -bg-grey explore">
              <div className="l-container">
                <header className="row">
                  <div className="column small-12 medium-8">
                    <h1 className="title c-text -header-huge -primary -thin">Explore the data</h1>
                  </div>
                </header>

                <div className="row">
                  <article className="column small-12 medium-5">
                    <p className="intro c-text -extra-big">
                      Explore, create visualizations, receive updates and contribute with your data.
                    </p>
                  </article>
                </div>

                <div className="row explore-cards">
                  {exploreCardsStatic}
                </div>
              </div>
            </section>

            <Banner className="get-involved">
              <div className="row">
                <div className="column small-12 medium-6">
                  <h1 className="title c-text -header-huge -thin">Get Involved</h1>
                  <p className="c-text -big">
                    We've brought together the best datasets related to natural resources,
                     so you can find new insights, influence decisions and change the world.
                     There's a world of opportunity to take this futher. Here are
                     some ideas to get you started.
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="column small-12 medium-3">
                  <button className="c-btn -transparent">
                    <Link route="get_involved_detail" params={{ id: 'contribute-data' }}><a>Contribute data</a></Link>
                  </button>
                </div>
                <div className="column small-12 medium-3">
                  <button className="c-btn -transparent">
                    <Link route="get_involved_detail" params={{ id: 'join-community' }}><a>Join the community</a></Link>
                  </button>
                </div>
                <div className="column small-12 medium-3">
                  <button className="c-btn -transparent">
                    <Link route="get_involved_detail" params={{ id: 'submit-an-insight' }}><a>Submit an insight</a></Link>
                  </button>
                </div>
                <div className="column small-12 medium-3">
                  <button className="c-btn -transparent">
                    <Link route="get_involved_detail" params={{ id: 'develop-app' }}>Develop your app</Link>
                  </button>
                </div>
              </div>
            </Banner>
          </div>
        </div>
      </Page>
    );
  }
}

export default Home;
