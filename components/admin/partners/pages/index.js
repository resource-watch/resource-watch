import React from 'react';
import PropTypes from 'prop-types';

// Components
import PartnersTable from 'components/admin/partners/table/PartnersTable';

export default function PartnersIndex({ user = {} }) {
  return (
    <div className="c-partners-index">
      <PartnersTable
        application={[process.env.APPLICATIONS]}
        authorization={user.token}
      />
    </div>
  );
}

PartnersIndex.propTypes = {
  user: PropTypes.object.isRequired
};
