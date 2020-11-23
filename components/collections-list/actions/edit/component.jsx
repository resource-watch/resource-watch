import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const EditAction = ({
  data: collection,
}) => (
  <Link
    href={`/myrw-detail/collections/${collection.id}`}
  >
    <button
      type="button"
      className="c-btn"
    >
      Edit
    </button>
  </Link>
);

EditAction.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default EditAction;
