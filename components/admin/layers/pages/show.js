import React from 'react';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// Components
import LayersForm from 'components/admin/layers/form/LayersForm';

function LayersShow(props) {
  const { id, user } = props;

  return (
    <div className="c-layers-show">
      {user.token &&
        <LayersForm
          id={id}
          application={[process.env.APPLICATIONS]}
          authorization={user.token}
          onSubmit={() => Router.pushRoute('admin_data', { tab: 'layers' })}
        />
      }
    </div>
  );
}

LayersShow.propTypes = {
  id: PropTypes.string.isRequired,
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default LayersShow;
