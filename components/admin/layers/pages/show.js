import React from 'react';
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
          onSubmit={() => {
            window.scrollTo(0, 0);
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
