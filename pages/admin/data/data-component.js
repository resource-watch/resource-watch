/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';

// Components
import Page from 'components/layout/page';
import Layout from 'components/layout/layout/layout-app';
import Tabs from 'components/ui/Tabs';

class DataPage extends Page {
  static propTypes = {
    exploreDetail: PropTypes.object
  };

  render() {
    console.log('data page', this);

    const { url, user, adminDataPage } = this.props;

    return (
      <Layout
        title="Data"
        description="Data description..."
        user={user}
        url={url}
      >
        {/* PAGE HEADER */}
        <div className="c-page-header -admin">
          <div className="l-container -admin">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content -with-tabs">
                  <h1>Data</h1>
                  <Tabs
                    options={adminDataPage.availableTabs}
                    defaultSelected={adminDataPage.tab}
                    selected={adminDataPage.tab}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="c-page-section">
          <div className="l-container -admin">
            <div className="row">
              <div className="column small-12">
                content here
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default DataPage;
