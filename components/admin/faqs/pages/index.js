import React from 'react';
import PropTypes from 'prop-types';

// Components
import FaqsTable from 'components/admin/faqs/table/FaqsTable';

export default function FaqsIndex(props) {
  const { user } = props;

  return (
    <div className="c-faqs-index">
      <FaqsTable
        application={[process.env.APPLICATIONS]}
        authorization={user.token}
      />
    </div>
  );
}

FaqsIndex.propTypes = {
  user: PropTypes.object.isRequired
};

FaqsIndex.defaultProps = {
  user: {}
};
