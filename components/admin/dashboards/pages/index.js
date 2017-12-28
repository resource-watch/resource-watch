import React from 'react';
import PropTypes from 'prop-types';

// Components
import DashboardsTable from 'components/dashboards/table/DashboardsTable';

export default function DashboardsIndex(props) {
  const { user } = props;

  return (
    <div className="c-dashboards-index">
      <DashboardsTable
        authorization={user.token}
      />
    </div>
  );
}

DashboardsIndex.propTypes = {
  user: PropTypes.object.isRequired
};

DashboardsIndex.defaultProps = {
  user: {}
};
