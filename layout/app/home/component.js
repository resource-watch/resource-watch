import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link, Router } from 'routes';
import MediaQuery from 'react-responsive';
import YouTube from 'react-youtube';

// components
import Layout from 'layout/layout/layout-app';
import Banner from 'components/app/common/Banner';
import TopicThumbnailList from 'components/topics/thumbnail-list';
import BlogLatestPosts from 'components/blog/latest-posts';
import ExploreCards from 'layout/app/home/explore-cards';

// utils
import { breakpoints } from 'utils/responsive';
import { browserSupported } from 'utils/browser';

// constants
import {
  VIDEO_ID,
  VIDEO_OPTIONS
} from './constants';

// styles
import './styles.scss';

class LayoutHome extends PureComponent {
  static propTypes = { responsive: PropTypes.object.isRequired }

  state = { videoReady: false }

  onVideoStateChange = ({ data }) => { this.setState({ videoReady: data === 1 }); };

  handleTopicSelection = ({ slug }) => {
    // TO-DO: we need to make an amendment in the Wysiwyg to have this working
    Router.pushRoute('topics_detail', { id: slug }).then(() => {
      window.scrollTo(0, 0);
    });
  }

  render() {
    const { responsive: { fakeWidth } } = this.props;
    const { videoReady } = this.state;
    const videoForegroundClass = classnames(
      'video-foreground',
      { '-ready': videoReady }
    );

    return (
      <Layout
        title="Monitoring the Planet’s Pulse — Resource Watch"
        description="Trusted and timely data for a sustainable future."
        className="l-home"
      >
        <div className="video-intro">
          <MediaQuery
            minDeviceWidth={breakpoints.medium}
            values={{ deviceWidth: fakeWidth }}
          >
            <div className={videoForegroundClass}>
              {browserSupported() && (
                <YouTube
                  videoId={VIDEO_ID}
                  opts={VIDEO_OPTIONS}
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

        <section
          id="discoverIsights"
          className="l-section"
        >
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
                <div className="column small-12">
                  <div className=" buttons">
                    <Link route="newsletter" >
                      <a className="c-button -secondary join-us-button">
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
                  <TopicThumbnailList onSelect={this.handleTopicSelection} />
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
              <div className="row">
                <ExploreCards />
              </div>
            </div>
          </div>
        </section>

        <Banner
          className="get-involved"
          bgImage="/static/images/backgrounds/mod_getInvolved.jpg"
        >
          <div className="l-container">
            <h2>Get involved</h2>
            <p>Use data to drive change in your community and around the world.</p>
            <div className="buttons -align-left">
              <Link route="sign-in">
                <a className="c-btn -alt -primary">Sign up</a>
              </Link>

              <Link
                route="get_involved_detail"
                params={{ id: 'join-the-community', source: 'home' }}
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

export default LayoutHome;
