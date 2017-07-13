import React from 'react';
import PropTypes from 'prop-types';

// Components
import DatasetTable from 'components/admin/dataset/table/DatasetTable';

function DatasetIndex(props) {
  const { user } = props;

  return (
    <div className="c-partners-index">
      <DatasetTable
        application={[process.env.APPLICATIONS]}
        authorization={user.token}
      />
    </div>
  );
}

DatasetIndex.propTypes = {
  user: PropTypes.object.isRequired
};

export default DatasetIndex;
