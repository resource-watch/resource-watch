import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import Layout from 'layout/layout/layout-admin';
import Tabs from 'components/ui/Tabs';
import DatasetsIndex from 'components/admin/data/datasets/pages/list';
import WidgetsIndex from 'components/admin/data/widgets/pages/list';
import LayersIndex from 'components/admin/data/layers/pages/list';
import ExploreForm from 'components/admin/data/explore-form';

// constants
import { DATA_TABS } from './constants';

class LayoutAdminData extends PureComponent {
  static propTypes = { query: PropTypes.object.isRequired }

  render() {
    const { query: { tab } } = this.props;
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
                {(currentTab === 'datasets') && (<DatasetsIndex />)}
                {(currentTab === 'widgets') && (<WidgetsIndex />)}
                {(currentTab === 'layers') && (<LayersIndex />)}
                {(currentTab === 'explore') && (<ExploreForm />)}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default LayoutAdminData;
