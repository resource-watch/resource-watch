import PropTypes from 'prop-types';

// components
import LayoutDashboardDetail from 'layout/app/dashboard-detail';

// hoc
import {
  withRedux,
  withUserServerSide,
} from 'hoc/auth';

// constants
import { DASHBOARD_DATA } from 'constants/coral-reefs-dashboard';

export default function CoralReefsDashboardPage({
  dashboard,
}) {
  return (
    <LayoutDashboardDetail
      dashboard={dashboard}
    />
  );
}

export const getServerSideProps = withRedux(withUserServerSide(async () => ({
  props: ({
    dashboard: DASHBOARD_DATA,
  }),
})));

CoralReefsDashboardPage.propTypes = {
  dashboard: PropTypes.shape({}).isRequired,
};
