import React from 'react';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// Components
import LayersForm from 'components/admin/layers/form/LayersForm';

function LayersNew(props) {
  const { user, dataset } = props;
  return (
    <div className="c-layers-new">
      <LayersForm
        application={[process.env.APPLICATIONS]}
        authorization={user.token}
        onSubmit={() => Router.pushRoute('admin_data', { tab: 'layers' })}
        dataset={dataset}
      />
    </div>
  );
}

LayersNew.propTypes = {
  dataset: PropTypes.string, // Id of the dataset to be pre-selected
  // Store
  user: PropTypes.object.isRequired
};

export default LayersNew;
