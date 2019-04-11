import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import Layout from 'layout/layout/layout-admin';
import Tabs from 'components/ui/Tabs';
import PartnersIndex from 'components/admin/partners/pages/list';
import Title from 'components/ui/Title';

// constants
import { PARTNERS_TABS } from './constants';

class LayoutAdminPartners extends PureComponent {
  static propTypes = { query: PropTypes.object.isRequired }

  render() {
    const { query: { tab } } = this.props;
    const currentTab = tab || 'partners';

    return (
      <Layout
        title="Partners"
        // TO-DO: fill description
        description="Partners description..."
      >
        <div className="c-page-header -admin">
          <div className="l-container -admin">
            <div className="page-header-content -with-tabs">
              <Title className="-primary -huge page-header-title" >
                Partners
              </Title>
              <Tabs
                options={PARTNERS_TABS}
                defaultSelected={currentTab}
                selected={currentTab}
              />
            </div>
          </div>
        </div>
        <div className="c-page-section">
          <div className="l-container -admin">
            <PartnersIndex />
          </div>
        </div>
      </Layout>
    );
  }
}

export default LayoutAdminPartners;
