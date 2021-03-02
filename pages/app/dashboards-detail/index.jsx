import React from 'react';
import PropTypes from 'prop-types';

// components
import LayoutDashboardDetail from 'layout/app/dashboard-detail';

// services
import {
  fetchDashboard,
} from 'services/dashboard';

const DashboardsDetailPage = ({
  dashboard,
}) => (
  <LayoutDashboardDetail
    dashboard={dashboard}
  />
);

// getInitialProps is used to improve SEO of these pages.
// TO-DO: replace with getStaticProps eventually
DashboardsDetailPage.getInitialProps = async (ctx) => {
  const {
    query: {
      slug,
    },
  } = ctx;
  const dashboard = await fetchDashboard(slug);

  return ({
    dashboard,
  });
};

DashboardsDetailPage.propTypes = {
  dashboard: PropTypes.shape({}).isRequired,
};

export default DashboardsDetailPage;
