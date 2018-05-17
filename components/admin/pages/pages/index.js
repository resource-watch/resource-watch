import React from 'react';
import PropTypes from 'prop-types';

// Components
import PagesTable from 'components/admin/pages/table/PagesTable';

export default function PagesIndex({ user = {} }) {
  return (
    <div className="c-pages-index">
      <PagesTable
        application={[process.env.APPLICATIONS]}
        authorization={user.token}
      />
    </div>
  );
}

PagesIndex.propTypes = {
  user: PropTypes.object.isRequired
};
