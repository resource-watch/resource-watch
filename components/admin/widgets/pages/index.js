import React from 'react';
import PropTypes from 'prop-types';

// Components
import WidgetsTable from 'components/admin/widgets/table/WidgetsTable';

export default function WidgetsIndex(props) {
  const { user } = props;

  return (
    <div className="c-widgets-index">
      <WidgetsTable
        application={[process.env.APPLICATIONS]}
        dataset={props.dataset}
        authorization={user.token}
      />
    </div>
  );
}

WidgetsIndex.propTypes = {
  user: PropTypes.object.isRequired,
  dataset: PropTypes.string
};

WidgetsIndex.defaultProps = {
  user: {}
};
