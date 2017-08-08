import React from 'react';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import DashboardsForm from 'components/admin/dashboards/form/DashboardsForm';

function DashboardsShow(props) {
  const { id, user } = props;

  return (
    <div className="c-dashboards-show">
      <DashboardsForm
        id={id}
        authorization={user.token}
        onSubmit={() => Router.pushRoute('admin_dashboards', { tab: 'dashboards' })}
      />
    </div>
  );
}

DashboardsShow.propTypes = {
  id: PropTypes.string,
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRedux(initStore, mapStateToProps, null)(DashboardsShow);
