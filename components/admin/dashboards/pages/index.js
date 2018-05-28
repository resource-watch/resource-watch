import React from 'react';
import PropTypes from 'prop-types';

// Components
import DashboardsTable from 'components/dashboards/table/DashboardsTable';

export default function DashboardsIndex({ user = {} }) {
  return (
    <div className="c-dashboards-index">
      <DashboardsTable
        authorization={user.token}
        env={process.env.API_ENV}
      />
    </div>
  );
}

DashboardsIndex.propTypes = {
  user: PropTypes.object.isRequired
};
