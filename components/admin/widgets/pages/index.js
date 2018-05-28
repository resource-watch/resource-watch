import React from 'react';
import PropTypes from 'prop-types';

// Components
import WidgetsTable from 'components/admin/widgets/table/WidgetsTable';

export default function WidgetsIndex(props) {
  const { user } = props;

  return (
    <div className="c-widgets-index">
      <WidgetsTable
        dataset={props.dataset}
        authorization={user.token}
      />
    </div>
  );
}

WidgetsIndex.defaultProps = { dataset: null };

WidgetsIndex.propTypes = {
  user: PropTypes.object.isRequired,
  dataset: PropTypes.string
};
