import { useRouter } from 'next/router';

// components
import Layout from 'layout/layout/layout-admin';
import Tabs from 'components/ui/Tabs';
import ToolsIndex from 'components/admin/tools/pages/list';
import Title from 'components/ui/Title';

// constants
import { TOOLS_TABS } from './constants';

export default function LayoutAdminTools() {
  const {
    query: {
      tab,
    },
  } = useRouter();
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
            <Title className="-primary -huge page-header-title">
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
