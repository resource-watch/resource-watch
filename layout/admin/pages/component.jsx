import React from 'react';

// components
import Layout from 'layout/layout/layout-admin';
import Tabs from 'components/ui/Tabs';
import PagesIndex from 'components/admin/pages/pages/list';
import Title from 'components/ui/Title';

// constants
import { PAGES_TABS } from './constants';

export default function LayoutAdminStaticPages() {
  return (
    <Layout
      title="Pages"
      description="Static Pages management"
    >
      <div className="c-page-header -admin">
        <div className="l-container -admin">
          <div className="page-header-content -with-tabs">
            <Title className="-primary -huge page-header-title">
              Pages
            </Title>
            <Tabs
              options={PAGES_TABS}
              defaultSelected={PAGES_TABS[0].value}
              selected={PAGES_TABS[0].value}
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
