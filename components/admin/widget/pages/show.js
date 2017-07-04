import React from 'react';
import PropTypes from 'prop-types';

// Components
import WidgetForm from 'components/admin/widget/form/WidgetForm';

const WidgetShow = function WidgetShow(props) {
  return (
    <WidgetForm
      application={['rw']}
      authorization={process.env.TEMP_TOKEN}
      widget={props.id}
    />
  );
};

WidgetShow.propTypes = {
  id: PropTypes.string
};

export default WidgetShow;
