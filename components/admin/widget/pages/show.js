import React from 'react';
import PropTypes from 'prop-types';

// Components
import WidgetForm from 'components/admin/widget/form/WidgetForm';

function WidgetShow(props) {
  const { id, user } = props;

  return (
    <WidgetForm
      application={[process.env.APPLICATIONS]}
      authorization={user.token}
      widget={id}
    />
  );
}

WidgetShow.propTypes = {
  id: PropTypes.string,
  // Store
  user: PropTypes.object.isRequired
};

export default WidgetShow;
