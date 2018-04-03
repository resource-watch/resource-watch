/* eslint max-len: 0 */
import React from 'react';
import { Link, Router } from 'routes';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { getInsights } from 'redactions/insights';
import * as topicsActions from 'layout/topics/topics-actions';
import YouTube from 'react-youtube';

// Layout
import Page from 'layout/page';
import Layout from 'layout/layout/layout-app';

// Components
import Banner from 'components/app/common/Banner';
import CardStatic from 'components/app/common/CardStatic';
import Rating from 'components/app/common/Rating';
import TopicThumbnailList from 'components/topics/thumbnail-list';

// Modal
import Modal from 'components/modal/modal-component';
import NewsletterModal from 'components/modal/newsletter-modal';

const exploreCards = [
  {
    tag: 'Planet Pulse',
    title: 'View near-real-time data on the planet',
    intro: '',
    buttons: [
      {
        text: 'Launch Planet Pulse',
        path: '/data/pulse',
        anchor: true,
        className: '-primary'
      }
    ],
    background: 'url(/static/images/homepage/home-data-bg4.png) 67% center'
  },
  {
    tag: 'Explore Data',
    title: 'Access data on the map',
    intro: 'Identify patterns between data sets on the map or download data for analysis.',
    buttons: [
      {
        text: 'Explore data',
        path: 'explore',
        className: '-primary'
      }
    ],
    background: 'url(/static/images/homepage/home-data-bg1.png)'
  },
  {
    tag: 'Dashboards',
    title: 'Create and share visualizations',
    intro: 'Create overlays, share visualizations, and subscribe to updates on your favorite issues.',
    buttons: [
      {
        text: 'Create a dashboard',
        path: 'dashboards',
        className: '-primary'
      }
    ],
    background: 'url(/static/images/homepage/home-data-bg2.png)'
  },
  {
    tag: 'Alerts',
    title: 'Track data in near-real-time',
    intro: 'Get updates on world events as they unfold.',
    buttons: [
      {
        text: 'Sign up for alerts',
        path: '/myrw/areas',
        anchor: true,
        className: '-primary'
      }
    ],
    background: 'url(/static/images/homepage/home-data-bg3.png) 67% center'
  }
];

class Home extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);

    // Dashboard thumbnail list
    context.store.dispatch(topicsActions.setSelected(null));

    await context.store.dispatch(topicsActions.fetchTopics({
      filters: { 'filter[published]': 'true' }
    }));

    return { ...props };
  }
  static insightsCardsStatic(insightsData) {
    return insightsData.map(c =>
      (<CardStatic
        key={`insight-card-${c.slug}`}
        className={`-alt ${c.link ? '-clickable' : ''}`}
        background={c.background}
        clickable={!!c.link}
        route={c.link ? c.link : ''}
      >
        <div>
          <h4>{c.tag}</h4>
          <h3>
            { c.link ?
              <Link route={`/blog/${c.slug}`}>
                <a>{c.title}</a>
              </Link>
              :
              <span>{c.title}</span>
            }
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
      </CardStatic>));
  }

  static exploreCardsStatic() {
    return exploreCards.map(c =>
      (<div key={`explore-card-${c.title}`} className="column small-12 medium-6">
        <CardStatic
          className="-alt"
          background={c.background}
          clickable
          route={c.buttons[0].path}
          anchor={c.buttons[0].anchor}
        >
          <div>
            <h4 className="tag-name">{c.tag}</h4>
            <h3 className="title">{c.title}</h3>
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

  constructor(props) {
    super(props);

    this.state = {
      showNewsletterModal: false,
      videoReady: false
    };
  }

  componentDidMount() {
    this.props.getInsights();
  }

  handleToggleShareModal = (bool) => {
    this.setState({ showNewsletterModal: bool });
  }

  onVideoReady = () => {
    if (YT.PlayerState.PLAYING === 1) { // eslint disable
      this.setState({ videoReady: true });
    }
  }

  render() {
    const { insights } = this.props;
    const { videoReady } = this.state;
    const insightsCardsStatic = Home.insightsCardsStatic(insights);
    const exploreCardsStatic = Home.exploreCardsStatic();
    const opts = {
      playerVars: {
        autoplay: 1,
        controls: 0,
        showinfo: 0,
        rel: 0,
        loop: 1,
        playlist: 'XryMlA-8IwE'
      }
    };
    return (
      <Layout
        title="Resource Watch"
        description="Monitoring the Planet’s Pulse"
        url={this.props.url}
        user={this.props.user}
        className="page-home"
      >
        <div className="video-intro">
          <div className={`video-foreground ${videoReady ? '-ready' : ''}`}>
            <YouTube
              videoId="XryMlA-8IwE"
              opts={opts}
              onStateChange={this.onVideoReady}
            />
          </div>
          <div className="video-text">
            <div>
              <h1>Monitoring the Planet&rsquo;s Pulse</h1>
              <p>Resource Watch provides trusted and timely data for a sustainable future.</p>
              <Link route="explore">
                <a
                  className="c-button -alt -primary"
                >
                  Explore data
                </a>
              </Link>
            </div>
          </div>
        </div>

        <section id="discoverIsights" className="l-section">
          <div className="l-container">
            <header>
              <div className="row">
                <div className="column small-12 medium-8">
                  <h2>Latest stories</h2>
                  <p>Discover data insights on the Resource Watch blog.</p>
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

            <div className="-text-center">
              <div className="row">
                <div className="column small-12 medium-12">
                  <div className=" buttons">
                    <button
                      className="c-button -secondary join-us-button"
                      onClick={() => this.handleToggleShareModal(true)}
                    >
                      Subscribe to our newsletter
                      <Modal
                        isOpen={this.state.showNewsletterModal}
                        className="-medium"
                        onRequestClose={() => this.handleToggleShareModal(false)}
                      >
                        <NewsletterModal />
                      </Modal>
                    </button>
                    <Link route="insights">
                      <a className="c-btn -primary">More stories</a>
                    </Link>
                  </div>
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
                  <h2>Topics</h2>
                  <p>
                    Find facts and figures on people and the environment, <br/>
                    or visualize the latest data on the world today.
                  </p>
                </div>
              </div>
            </header>
            <div className="topics-container">
              <div className="row">
                <div className="column small-12">
                  <TopicThumbnailList
                    portraitMode
                    onSelect={({ slug }) => {
                      // We need to make an amendment in the Wysiwyg to have this working
                      Router.pushRoute('topics_detail', { id: slug })
                        .then(() => {
                          window.scrollTo(0, 0);
                        });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="l-section">
          <div className="l-container">
            <header>
              <div className="row">
                <div className="column small-12 medium-8">
                  <h2>Dive into the data</h2>
                  <p>Create overlays, share visualizations, and subscribe to updates on your favorite issues.</p>
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
              <div className="column small-12 medium-8">
                <h2>Get involved</h2>
                <p>
                  Use data to drive change in your community and around the world.
                </p>
              </div>
            </div>
            <div className="buttons">
              <div className="l-row row">
                <div className="column small-12 medium-3">
                  <Link route="get_involved_detail" params={{ id: 'join-community', source: 'home' }}><a className="c-btn -b -alt -fullwidth">Join the community</a></Link>
                </div>
                <div className="column small-12 medium-3">
                  <Link route="get_involved_detail" params={{ id: 'contribute-data', source: 'home' }}><a className="c-btn -b -alt -fullwidth">Contribute data</a></Link>
                </div>
                <div className="column small-12 medium-3">
                  <Link route="get_involved_detail" params={{ id: 'submit-an-insight', source: 'home' }}><a className="c-btn -b -alt -fullwidth">Suggest a story</a></Link>
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

const mapDispatchToProps = {
  getInsights
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Home);
