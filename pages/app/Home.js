/* eslint max-len: 0 */
import React, { Component } from 'react';
import { Link, Router } from 'routes';
import { connect } from 'react-redux';

// Utils
import { breakpoints } from 'utils/responsive';

// Redux
import * as topicsActions from 'layout/topics/topics-actions';
import * as blogActions from 'components/blog/latest-posts/actions';

// Layout
import Layout from 'layout/layout/layout-app';

// Components
import Banner from 'components/app/common/Banner';
import CardStatic from 'components/app/common/CardStatic';
import TopicThumbnailList from 'components/topics/thumbnail-list';
import BlogLatestPosts from 'components/blog/latest-posts';
import YouTube from 'react-youtube';
import MediaQuery from 'react-responsive';
import LoginRequired from 'components/ui/login-required';
import { browserSupported } from 'utils/browser';

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
    intro: 'Create and share custom visualizations or craft your own personal monitoring system.',
    buttons: [
      {
        text: 'Create a dashboard',
        path: '/myrw/dashboards',
        anchor: true,
        loginRequired: 'Log in to create a dashboard',
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
        loginRequired: 'Log in to sign up for alerts',
        className: '-primary'
      }
    ],
    background: 'url(/static/images/homepage/home-data-bg3.png) 67% center'
  }
];

class Home extends Component {
  static async getInitialProps({ store }) {
    // Dashboard thumbnail list
    store.dispatch(topicsActions.setSelected(null));

    await store.dispatch(
      topicsActions.fetchTopics({ filters: { 'filter[published]': 'true' } })
    );

    // Get blog posts
    await store.dispatch(blogActions.fetchBlogPostsLatest());
    await store.dispatch(blogActions.fetchBlogPostsSpotlightLatest());

    return {};
  }

  static exploreCardsStatic() {
    return exploreCards.map(c => (
      <div key={`explore-card-${c.title}-${c.tag}`} className="column small-12 medium-6">
        <CardStatic
          className="-alt -clickable"
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
              if (b.loginRequired) {
                return (
                  <LoginRequired key={b.path} text={b.loginRequired}>
                    <a href={b.path} className={`c-btn -alt ${b.className}`}>
                      {b.text}
                    </a>
                  </LoginRequired>
                );
              }
              if (b.anchor) {
                return (
                  <a href={b.path} key={b.path} className={`c-btn -alt ${b.className}`}>
                    {b.text}
                  </a>
                );
              }
              return (
                <Link route={b.path} key={b.path}>
                  <a className={`c-btn -alt ${b.className}`}>{b.text}</a>
                </Link>
              );
            })}
          </div>
        </CardStatic>
      </div>
    ));
  }

  constructor(props) {
    super(props);

    this.state = {
      videoReady: false,
      videoHeight: 0,
      videoWidth: 0
    };
  }


  onVideoStateChange = (state) => {
    const { data } = state;
    if (data === 1) {
      // eslint disable
      this.setState({ videoReady: true });
    } else {
      this.setState({ videoReady: false });
    }
  };

  render() {
    const { responsive } = this.props;
    const { videoReady } = this.state;
    const exploreCardsStatic = Home.exploreCardsStatic();
    const videoOpts = {
      playerVars: {
        modestbranding: 1,
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
        title="Monitoring the Planet’s Pulse — Resource Watch"
        description="Trusted and timely data for a sustainable future."
        url={this.props.url}
        user={this.props.user}
        className="page-home"
      >
        <div className="video-intro">
          <MediaQuery
            minDeviceWidth={breakpoints.medium}
            values={{ deviceWidth: responsive.fakeWidth }}
          >
            <div className={`video-foreground ${videoReady ? '-ready' : ''}`}>
              {browserSupported() && (
                <YouTube
                  videoId="XryMlA-8IwE"
                  opts={videoOpts}
                  onStateChange={this.onVideoStateChange}
                />
              )}
            </div>
          </MediaQuery>
          <div className="video-text">
            <div>
              <h1>Monitoring the Planet&rsquo;s Pulse</h1>
              <p>Resource Watch provides trusted and timely data for a sustainable future.</p>
              <Link route="explore">
                <a className="c-button -alt -primary">Explore data</a>
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

            <BlogLatestPosts />

            <div className="-text-center">
              <div className="row">
                <div className="column small-12 medium-12">
                  <div className=" buttons">
                    <Link route="newsletter" >
                      <a
                        className="c-button -secondary join-us-button"
                      >
                        Subscribe to our newsletter
                      </a>
                    </Link>
                    <a href="/blog" className="c-btn -primary">
                      More stories
                    </a>
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
                    Find facts and figures on people and the environment, <br />
                    or visualize the latest data on the world today.
                  </p>
                </div>
              </div>
            </header>
            <div className="topics-container">
              <div className="row">
                <div className="column small-12">
                  <TopicThumbnailList
                    // portraitMode
                    onSelect={({ slug }) => {
                      // We need to make an amendment in the Wysiwyg to have this working
                      Router.pushRoute('topics_detail', { id: slug }).then(() => {
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
                  <p>
                    Create overlays, share visualizations, and subscribe to updates on your favorite
                    issues.
                  </p>
                </div>
              </div>
            </header>

            <div className="explore-cards">
              <div className="row">{exploreCardsStatic}</div>
            </div>
          </div>
        </section>

        <Banner className="get-involved" bgImage="/static/images/backgrounds/mod_getInvolved.jpg">
          <div className="l-container">
            <h2>Get involved</h2>
            <p>Use data to drive change in your community and around the world.</p>
            <div className="buttons -align-left">
              <Link route="sign-in">
                <a className="c-btn -alt -primary">Sign up</a>
              </Link>

              <Link
                route="get_involved_detail"
                params={{ id: 'join-community', source: 'home' }}
              >
                <a className="c-btn -b -alt">Join the community</a>
              </Link>

              <Link
                route="get_involved_detail"
                params={{ id: 'contribute-data', source: 'home' }}
              >
                <a className="c-btn -b -alt">Contribute data</a>
              </Link>

              <Link
                route="get_involved_detail"
                params={{ id: 'submit-an-insight', source: 'home' }}
              >
                <a className="c-btn -b -alt">Suggest a story</a>
              </Link>

              <Link
                route="get_involved_detail"
                params={{ id: 'develop-your-app', source: 'home' }}
              >
                <a className="c-btn -b -alt">Develop your app</a>
              </Link>
            </div>
          </div>
        </Banner>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({ responsive: state.responsive });

export default connect(mapStateToProps, null)(Home);
