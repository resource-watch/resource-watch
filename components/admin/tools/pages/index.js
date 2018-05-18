import React from 'react';
import PropTypes from 'prop-types';

// Components
import ToolsTable from 'components/admin/tools/table/ToolsTable';

export default function ToolsIndex({ user = {} }) {
  return (
    <div className="c-tools-index">
      <ToolsTable
        application={[process.env.APPLICATIONS]}
        authorization={user.token}
      />
    </div>
  );
}

ToolsIndex.propTypes = {
  user: PropTypes.object.isRequired
};
