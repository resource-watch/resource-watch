/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';

// Components
import Page from 'components/layout/page';
import Layout from 'components/layout/layout/layout-app';
import Tabs from 'components/ui/Tabs';

// Tabs
import DatasetsTab from 'components/admin/datasets/DatasetsTab';
import WidgetsTab from 'components/admin/widgets/WidgetsTab';
import LayersTab from 'components/admin/layers/LayersTab';

class DataPage extends Page {
  static propTypes = {
    adminDataPage: PropTypes.object
  };

  render() {
    const { url, user, adminDataPage } = this.props;
    const { tab, subtab, id } = adminDataPage;

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

                {tab === 'datasets' &&
                  <DatasetsTab tab={tab} subtab={subtab} id={id} />
                }

                {tab === 'widgets' &&
                  <WidgetsTab tab={tab} subtab={subtab} id={id} />
                }

                {tab === 'layers' &&
                  <LayersTab tab={tab} subtab={subtab} id={id} />
                }

              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default DataPage;
