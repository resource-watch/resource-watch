import React from 'react';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';


// Components
import WidgetsForm from 'components/admin/widgets/form/WidgetsForm';

function WidgetsNew(props) {
  const { user, dataset } = props;

  return (
    <div className="c-widgets-new">
      <WidgetsForm
        authorization={user.token}
        onSubmit={() => Router.pushRoute('admin_data', { tab: 'widgets' })}
        dataset={dataset}
      />
    </div>
  );
}

WidgetsNew.propTypes = {
  dataset: PropTypes.string, // ID of the dataset that should be pre-selected
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(WidgetsNew);
