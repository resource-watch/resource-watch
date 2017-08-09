import React from 'react';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// Components
import DatasetsForm from 'components/datasets/form/DatasetsForm';

function DatasetsNew(props) {
  const { user } = props;

  return (
    <div className="c-datasets-new">
      <DatasetsForm
        minimized
        application={[process.env.APPLICATIONS]}
        authorization={user.token}
        onSubmit={() => Router.pushRoute('admin_data', { tab: 'datasets' })}
      />
    </div>
  );
}

DatasetsNew.propTypes = {
  // Store
  user: PropTypes.object.isRequired
};

export default DatasetsNew;
