import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// components
import Layout from 'layout/layout/layout-admin';
import Tabs from 'components/ui/Tabs';
import PagesIndex from 'components/admin/pages/pages/list';
import Title from 'components/ui/Title';

// constants
import { PAGES_TABS } from './constants';

class LayoutAdminPages extends PureComponent {
  static propTypes = { query: PropTypes.object.isRequired }

  render() {
    const { query: { tab } } = this.props;
    // TO-DO: set properly this in express
    const currentTab = tab || 'pages';

    return (
      <Layout
        title="Pages"
        // TO-DO: fill description
        description="Pages description..."
      >
        <div className="c-page-header -admin">
          <div className="l-container -admin">
            <div className="page-header-content -with-tabs">
              <Title className="-primary -huge page-header-title">
                Pages
              </Title>
              <Tabs
                options={PAGES_TABS}
                defaultSelected={currentTab}
                selected={currentTab}
              />
            </div>
          </div>
        </div>
        <div className="c-page-section">
          <div className="l-container -admin">
            <PagesIndex />
          </div>
        </div>
      </Layout>
    );
  }
}

export default LayoutAdminPages;
