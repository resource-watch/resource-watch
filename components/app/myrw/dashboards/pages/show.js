import React from 'react';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';


// Components
import DashboardsForm from 'components/dashboards/form/DashboardsForm';

function DashboardsShow(props) {
  const { id, user } = props;

  return (
    <div className="c-dashboards-show">
      <DashboardsForm
        id={id}
        basic
        user={user}
        onSubmit={() => Router.pushRoute('myrw', { tab: 'dashboards' })}
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

export default connect(mapStateToProps, null)(DashboardsShow);
