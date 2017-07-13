import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// Components
import WidgetForm from 'components/admin/widget/form/WidgetForm';

function WidgetNew(props) {
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
}

WidgetNew.propTypes = {
  id: PropTypes.string,
  // Store
  user: PropTypes.object.isRequired
};

export default WidgetNew;
