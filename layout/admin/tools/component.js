import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import Layout from 'layout/layout/layout-admin';
import Tabs from 'components/ui/Tabs';
import ToolsIndex from 'components/admin/tools/pages/list';
import Title from 'components/ui/Title';

// contants
import { TOOLS_TABS } from './constants';

class LayoutAdminTools extends PureComponent {
  static propTypes = {
    query: PropTypes.object.isRequired,
    hostname: PropTypes.string.isRequired
  }

  render() {
    const { query: { tab }, hostname } = this.props;
    // TO-DO: set properly this in express
    const currentTab = tab || 'tools';

    return (
      <Layout
        title="Tools"
        // TO-DO: fill description
        description="Tools description..."
        hostname={hostname}
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
            <ToolsIndex />
          </div>
        </div>
      </Layout>
    );
  }
}

export default LayoutAdminTools;
