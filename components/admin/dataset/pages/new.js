import React from 'react';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// Components
import DatasetForm from 'components/admin/dataset/form/DatasetForm';

function DatasetNew(props) {
  const { user } = props;

  return (
    <div className="c-datasets-new">
      <DatasetForm
        application={[process.env.APPLICATIONS]}
        authorization={user.token}
        onSubmit={() => Router.pushRoute('admin_data', { tab: 'datasets' })}
      />
    </div>
  );
}

DatasetNew.propTypes = {
  // Store
  user: PropTypes.object.isRequired
};

export default DatasetNew;
