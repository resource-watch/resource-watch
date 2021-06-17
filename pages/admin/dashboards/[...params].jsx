import {
  useMemo,
} from 'react';
import { useRouter } from 'next/router';
import { singular } from 'pluralize';

// components
import Layout from 'layout/layout/layout-admin';
import DashboardsTab from 'components/admin/dashboards/DashboardsTab';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Title from 'components/ui/Title';

// hoc
import {
  withAdminRole,
} from 'hoc/auth';

// hooks
import {
  useFetchDashboard,
} from 'hooks/dashboard';

// Utils
import { capitalizeFirstLetter } from 'utils/utils';

export default function AdminDashboardsDetailPage() {
  const {
    query: {
      params,
    },
  } = useRouter();

  const tab = params?.[0] || null;
  const id = params?.[1] || null;
  const subtab = params?.[2] || null;

  const {
    data: dashboard,
  } = useFetchDashboard(id, {
    enabled: !!(id && id !== 'new'),
  });

  const name = useMemo(() => {
    if (id === 'new') {
      return `New ${singular(tab)}`;
    }

    return dashboard?.name || '-';
  }, [id, dashboard, tab]);

  return (
    <Layout
      title={name}
      // TO-DO: fill description
      description="Dashboards detail..."
    >
      <div className="c-page-header -admin">
        <div className="l-container -admin">
          <div className="row">
            <div className="column small-12">
              <div className="page-header-content">
                <Breadcrumbs
                  items={[{ name: capitalizeFirstLetter(tab), route: '/admin/dashboards' }]}
                />
                <Title className="-primary -huge page-header-title">
                  {name}
                </Title>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="c-page-section">
        <div className="l-container -admin">
          <div className="row">
            <div className="column small-12">
              {tab === 'dashboards' && (<DashboardsTab tab={tab} subtab={subtab} id={id} />)}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = withAdminRole();
