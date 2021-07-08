import PropTypes from 'prop-types';

// hoc
import {
  withRedux,
  withUserServerSide,
} from 'hoc/auth';

// components
import LayoutDashboardDetail from 'layout/app/dashboard-detail';

// services
import {
  fetchDashboard,
} from 'services/dashboard';

export default function DashboardsDetailPage({
  dashboard,
}) {
  return (
    <LayoutDashboardDetail
      dashboard={dashboard}
    />
  );
}

export const getServerSideProps = withRedux(withUserServerSide(async ({ query }) => {
  const {
    slug,
  } = query;
  const dashboard = await fetchDashboard(slug);

  return ({
    props: ({
      dashboard,
    }),
  });
}));

DashboardsDetailPage.propTypes = {
  dashboard: PropTypes.shape({}).isRequired,
};
