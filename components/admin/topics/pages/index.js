import React from 'react';
import PropTypes from 'prop-types';

// Components
import TopicsTable from 'components/topics/table/TopicsTable';

export default function TopicsIndex(props) {
  const { user } = props;

  return (
    <div className="c-topics-index">
      <TopicsTable
        authorization={user.token}
      />
    </div>
  );
}

TopicsIndex.propTypes = {
  user: PropTypes.object.isRequired
};
