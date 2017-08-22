import React from 'react';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';


// Components
import DashboardsForm from 'components/dashboards/form/DashboardsForm';

function DashboardsNew(props) {
  const { user } = props;

  return (
    <div className="c-dashboards-new">
      <DashboardsForm
        user={user}
        onSubmit={() => Router.pushRoute('admin_dashboards', { tab: 'dashboards' })}
      />
    </div>
  );
}

DashboardsNew.propTypes = {
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(DashboardsNew);
