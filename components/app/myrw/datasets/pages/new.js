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
        basic
        application={[process.env.APPLICATIONS]}
        authorization={user.token}
        onSubmit={() => Router.pushRoute('myrw', { tab: 'datasets', subtab: 'my_datasets' })}
      />
    </div>
  );
}

DatasetsNew.propTypes = {
  // Store
  user: PropTypes.object.isRequired
};

export default DatasetsNew;
