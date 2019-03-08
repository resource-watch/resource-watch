import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import Layout from 'layout/layout/layout-admin';
import Tabs from 'components/ui/Tabs';
import DatasetsTab from 'components/admin/datasets/DatasetsTab';
import WidgetsTab from 'components/admin/widgets/WidgetsTab';
import LayersTab from 'components/admin/layers/LayersTab';

// constants
import { DATA_TABS } from './constants';

class LayoutAdminData extends PureComponent {
  static propTypes = { query: PropTypes.object.isRequired }

  render() {
    const { query: { tab, subtab, id } } = this.props;
    // TO-DO: set properly this in express
    const currentTab = tab || 'datasets';

    return (
      <Layout
        title="Data"
        // TO-DO: fill description
        description="Data description..."
      >
        <div className="c-page-header -admin">
          <div className="l-container -admin">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content -with-tabs">
                  <h1>Data</h1>
                  <Tabs
                    options={DATA_TABS}
                    defaultSelected={currentTab}
                    selected={currentTab}
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
                {currentTab === 'datasets' && (<DatasetsTab tab={currentTab} subtab={subtab} id={id} />)}
                {currentTab === 'widgets' && (<WidgetsTab tab={currentTab} subtab={subtab} id={id} />)}
                {currentTab === 'layers' && (<LayersTab tab={currentTab} subtab={subtab} id={id} />)}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default LayoutAdminData;
