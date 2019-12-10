import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// components
import Layout from 'layout/layout/layout-app';
import TopicThumbnailList from 'components/topics/thumbnail-list';
import DashboardThumbnailList from 'components/dashboards/thumbnail-list';

import Banner from 'components/app/common/Banner';
import LoginRequired from 'components/ui/login-required';

class TopicsLayout extends PureComponent {
  static propTypes = { data: PropTypes.object, dashboards: PropTypes.array }

  static defaultProps = {
    data: {},
    dashboards: []
  }

  render() {
    const { data, dashboards } = this.props;

    const styles = {};
    if (data && data.photo) {
      styles.backgroundImage = `url(${process.env.STATIC_SERVER_URL}${data.photo.cover})`;
    }

    return (
      <Layout
        title="Dashboards"
        description="The latest facts and figures on cities, energy, food and more."
        className="l-static p-topics"
      >
        <div className="l-content">
          <div className="l-content-header">
            <div className="cover" style={styles}>
              <div className="row">
                <div className="column small-12">
                  <div className="content">
                    <h1>Dashboards</h1>
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
                <TopicThumbnailList
                  onSelect={({ slug }) => {
                    // We need to make an amendment in the Wysiwyg to have this working
                    Router.pushRoute('dashboards_detail', { id: slug })
                      .then(() => {
                        window.scrollTo(0, 0);
                      });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="l-section -small">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <DashboardThumbnailList dashboards={dashboards} />
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
