import React from 'react';
import { useRouter } from 'next/router';

// components
import LayoutDashboardDetail from 'layout/app/dashboard-detail';

// hooks
import useFetchDashboard from 'hooks/dashboard/fetch-dashboard';

const DashboardsDetailPage = () => {
  const {
    query: {
      slug,
    },
  } = useRouter();

  const dashboardState = useFetchDashboard(
    slug,
    {},
    {
      enabled: slug,
      initialData: {},
      initialStale: true,
    },
  );

  return (
    <LayoutDashboardDetail
      dashboardState={dashboardState}
    />
  );
};

export default DashboardsDetailPage;
