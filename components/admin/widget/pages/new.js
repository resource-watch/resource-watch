import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// Components
import WidgetForm from 'components/admin/widget/form/WidgetForm';

const DatasetNew = function DatasetNew(props) {
  return (
    <div className="c-widgets-new">
      <WidgetForm
        application={['rw']}
        authorization={`${process.env.TEMP_TOKEN}`}
        onSubmit={() => Router.pushRoute('admin_data', { tab: 'datasets' })}
        dataset={props.id}
      />
    </div>
  );
};

DatasetNew.propTypes = {
  id: PropTypes.string
};

export default DatasetNew;
