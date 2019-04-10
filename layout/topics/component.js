import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// components
import Layout from 'layout/layout/layout-app';
import TopicThumbnailList from 'components/topics/thumbnail-list';
import TopicThumbnail from 'components/topics/thumbnail';
import Banner from 'components/app/common/Banner';
import LoginRequired from 'components/ui/login-required';

class TopicsLayout extends PureComponent {
  static propTypes = { data: PropTypes.object }

  static defaultProps = { data: {} };

  render() {
    const { data } = this.props;

    const styles = {};
    if (data && data.photo) {
      styles.backgroundImage = `url(${process.env.STATIC_SERVER_URL}${data.photo.cover})`;
    }

    return (
      <Layout
        title="Dashboards — Resource Watch"
        description="The latest facts and figures on cities, energy, food and more."
        className="l-static c-page-dashboards"
      >
        <div className="l-content">
          <div className="l-content-header">
            <div className="cover" style={styles}>
              <div className="row">
                <div className="column small-12">
                  <div className="content">
                    <h1>{data.title || 'Dashboards'}</h1>
                    <p>{data.summary || ''}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="l-section -small">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <h2>Featured dashboards</h2>
              </div>
            </div>
            <div className="row">
              <div className="column small-12">
                <TopicThumbnailList
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
            <div className="row">
              <div className="column small-12">
                <h2>Dashboards gallery</h2>
              </div>
            </div>
            <div className="row">
              <div className="column small-12">
                {
                  // IMPORTANT!! THIS IS A TEMPORAL FIX!!!
                }
                <TopicThumbnail
                  topic={{
                    slug: 'land-use-and-land-cover-change',
                    name: 'Land Use and Land Cover Change',
                    photo: {
                      cover: 'https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/topics/photos/000/000/028/cover/data?1550869295',
                      thumb: 'https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/topics/photos/000/000/028/thumb/data?1550869295',
                      medium: 'https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/topics/photos/000/000/028/medium/data?1550869295',
                      original: 'https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/topics/photos/000/000/028/original/data?1550869295'
                    }
                  }}
                  onSelect={({ slug }) => {
                    // There was an issue when using Router.push instead
                    // TO-DO this needs to be updated so that Router is used instead.
                    window.location = `/data/dashboards/${slug}?goTo=topics`;
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <aside className="l-postcontent">
          <div className="l-container">
            <div className="row align-center">
              <div className="column small-12">
                <Banner className="-text-center">
                  <p className="-claim">
                    Create and share <br />custom visualizations.
                  </p>
                  <LoginRequired>
                    <a
                      href="/myrw/dashboards"
                      className="c-button -alt -primary"
                    >
                      Create a dashboard
                    </a>
                  </LoginRequired>
                </Banner>
              </div>
            </div>
          </div>
        </aside>
      </Layout>
    );
  }
}

export default TopicsLayout;
