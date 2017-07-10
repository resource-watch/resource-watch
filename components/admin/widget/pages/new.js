import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import WidgetForm from 'components/admin/widget/form/WidgetForm';

const DatasetNew = function DatasetNew(props) {
  return (
    <div className="c-widgets-new">
      <WidgetForm
        application={[process.env.APPLICATIONS]}
        authorization={props.user.token}
        onSubmit={() => Router.pushRoute('admin_data', { tab: 'widgets' })}
        dataset={props.id}
      />
    </div>
  );
};

DatasetNew.propTypes = {
  id: PropTypes.string,
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRedux(initStore, mapStateToProps, null)(DatasetNew);
