import React from 'react';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import DashboardsForm from 'components/admin/dashboards/form/DashboardsForm';

function DashboardsNew(props) {
  const { user } = props;

  return (
    <div className="c-dashboards-new">
      <DashboardsForm
        authorization={user.token}
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

export default withRedux(initStore, mapStateToProps, null)(DashboardsNew);
