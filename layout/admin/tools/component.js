import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import Layout from 'layout/layout/layout-admin';
import Tabs from 'components/ui/Tabs';
import ToolsTab from 'components/admin/tools/ToolsTab';
import Title from 'components/ui/Title';

// contants
import { TOOLS_TABS } from './constants';

class LayoutAdminTools extends PureComponent {
  static propTypes = { query: PropTypes.object.isRequired }

  render() {
    const { query: { tab, subtab, id } } = this.props;
    // TO-DO: set properly this in express
    const currentTab = tab || 'tools';

    return (
      <Layout
        title="Tools"
        // TO-DO: fill description
        description="Tools description..."
      >
        <div className="c-page-header -admin">
          <div className="l-container -admin">
            <div className="page-header-content -with-tabs">
              <Title className="-primary -huge page-header-title" >
                Tools
              </Title>
              <Tabs
                options={TOOLS_TABS}
                defaultSelected={currentTab}
                selected={currentTab}
              />
            </div>
          </div>
        </div>
        <div className="c-page-section">
          <div className="l-container -admin">
            {currentTab === 'tools' && (<ToolsTab tab={currentTab} subtab={subtab} id={id} />)}
          </div>
        </div>
      </Layout>
    );
  }
}

export default LayoutAdminTools;
