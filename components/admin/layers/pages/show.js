import React from 'react';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// Components
import LayersForm from 'components/admin/layers/form/LayersForm';

function LayersShow(props) {
  const { id, dataset, user } = props;

  return (
    <div className="c-layers-show">
      {user.token &&
        <LayersForm
          id={id}
          application={[process.env.APPLICATIONS]}
          authorization={user.token}
          onSubmit={() => {
            if (dataset) {
              Router.pushRoute('admin_data_detail', { tab: 'datasets', subtab: 'layers', id: dataset });
            } else {
              Router.pushRoute('admin_data', { tab: 'layers' });
            }
          }}
        />
      }
    </div>
  );
}

LayersShow.propTypes = {
  id: PropTypes.string.isRequired,
  dataset: PropTypes.string,
  // Store
  user: PropTypes.object.isRequired
};

export default LayersShow;
