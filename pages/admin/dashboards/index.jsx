import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

// hoc
import {
  withAdminRole,
} from 'hoc/auth';

// Components
import Layout from 'layout/layout/layout-admin';
import Tabs from 'components/ui/Tabs';
import Title from 'components/ui/Title';
import DashboardsIndex from 'components/admin/dashboards/pages/index';

// constants
const DATA_TABS = [{
  label: 'Dashboards',
  value: 'dashboards',
  route: '/admin/dashboards',
  params: {},
}];

export default function AdminDashboardsPage({
  user,
}) {
  const {
    query: {
      tab,
    },
  } = useRouter();
  const currentTab = tab || 'dashboards';

  return (
    <Layout
      title="Dashboards"
      // TO-DO: fill description
      description="Dashboards description..."
    >
      {/* PAGE HEADER */}
      <div className="c-page-header -admin">
        <div className="l-container -admin">
          <div className="row">
            <div className="column small-12">
              <div className="page-header-content -with-tabs">
                <Title className="-primary -huge page-header-title">
                  Dashboards
                </Title>
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
              <DashboardsIndex user={user} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

AdminDashboardsPage.propTypes = {
  user: PropTypes.shape({}).isRequired,
};

export const getServerSideProps = withAdminRole();
