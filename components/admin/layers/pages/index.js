import React from 'react';
import PropTypes from 'prop-types';

// Components
import LayersTable from 'components/admin/layers/table/LayersTable';

function LayersIndex(props) {
  const { user, dataset } = props;

  return (
    <div className="c-layers-index">
      <LayersTable
        application={[process.env.APPLICATIONS]}
        dataset={dataset}
        authorization={user.token}
      />
    </div>
  );
}

LayersIndex.propTypes = {
  user: PropTypes.object.isRequired,
  dataset: PropTypes.string
};

export default LayersIndex;
