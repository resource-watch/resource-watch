import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// components
import Layout from 'layout/layout/layout-app';
import DashboardThumbnailList from 'components/dashboards/thumbnail-list';

import Banner from 'components/app/common/Banner';
import LoginRequired from 'components/ui/login-required';

class DashboardsLayout extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    dashHighlighted: PropTypes.array,
    dashFeatured: PropTypes.array,
  }

  static defaultProps = {
    data: {},
    dashHighlighted: [],
    dashFeatured: [],
  }

  render() {
    const { data, dashHighlighted, dashFeatured } = this.props;

    const styles = {};
    if (data && data.photo) {
      styles.backgroundImage = `url(${process.env.STATIC_SERVER_URL}${data.photo.cover})`;
    }

    return (
      <Layout
        title="Dashboards"
        description="The latest facts and figures on cities, energy, food and more."
        className="l-static"
      >
        <div className="l-content">
          <div className="l-content-header">
            <div className="cover" style={styles}>
              <div className="row">
                <div className="column small-12">
                  <div className="content">
                    <h1>Dashboards</h1>
                    <p>{data.summary || 'Find data and visualizations for different topic areas of interest'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="featuredDashboards" className="l-section -small">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="c-dashboards-subheader-block">
                  <h2>Featured dashboards</h2>
                  <p>
                    Discover collections of curated data on the major
                    challenges facing human society and the planet
                  </p>
                </div>
                <DashboardThumbnailList
                  onSelect={({ slug }) => {
                    Router.pushRoute('dashboards_detail', { slug })
                      .then(() => {
                        window.scrollTo(0, 0);
                      });
                  }}
                  dashboards={dashFeatured}
                />
              </div>
            </div>
          </div>
        </div>
        {dashHighlighted.length > 0
          && (
          <div id="dashboardsGallery" className="l-section -small">
            <div className="l-container">
              <div className="row">
                <div className="column small-12">
                  <div className="c-dashboards-subheader-block">
                    <h2>Dashboard gallery</h2>
                    <p>
                      Browse collections of data and visualizations
                      developed by the Resource Watch team and partners
                    </p>
                  </div>
                  <DashboardThumbnailList
                    onSelect={({ slug }) => {
                      Router.pushRoute('dashboards_detail', { slug })
                        .then(() => {
                          window.scrollTo(0, 0);
                        });
                    }}
                    dashboards={dashHighlighted}
                    user
                  />
                </div>
              </div>
            </div>
          </div>
          )}
        <aside className="l-postcontent">
          <div className="l-container">
            <div className="row align-center">
              <div className="column small-12">
                <Banner className="-text-center">
                  <p className="-claim">
                    Create and share
                    {' '}
                    <br />
                    custom visualizations.
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

export default DashboardsLayout;
