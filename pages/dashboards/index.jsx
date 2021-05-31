import PropTypes from 'prop-types';

// services
import {
  fetchPage,
} from 'services/pages';

// components
import LayoutDashboards from 'layout/app/dashboards';

export default function DashboardsPage({ dataPage }) {
  return (<LayoutDashboards dataPage={dataPage} />);
}

DashboardsPage.getInitialProps = async () => {
  const dataPage = await fetchPage('dashboards');

  return ({
    dataPage,
  });
};

DashboardsPage.propTypes = {
  dataPage: PropTypes.shape({}).isRequired,
};
