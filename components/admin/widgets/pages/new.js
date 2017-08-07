import React from 'react';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import WidgetsForm from 'components/admin/widgets/form/WidgetsForm';

function WidgetsNew(props) {
  const { user } = props;

  return (
    <div className="c-widgets-new">
      <WidgetsForm
        authorization={user.token}
        onSubmit={() => Router.pushRoute('admin_data', { tab: 'widgets' })}
      />
    </div>
  );
}

WidgetsNew.propTypes = {
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRedux(initStore, mapStateToProps, null)(WidgetsNew);
