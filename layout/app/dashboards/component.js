import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import Layout from 'layout/layout/layout-app';
import DashboardThumbnailList from 'components/dashboards/thumbnail-list';

class LayoutDashboards extends PureComponent {
  static propTypes = { dashboards: PropTypes.array.isRequired }

  render() {
    const { dashboards } = this.props;

    return (
      <Layout
        title="Dashboards"
        description="Resource Watch Dashboards"
        pageHeader
      >
        <div className="l-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <h1>Dashboards</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="l-section">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <DashboardThumbnailList dashboards={dashboards} />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default LayoutDashboards;
