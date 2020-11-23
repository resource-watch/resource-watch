import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

// components
import ForwardLink from 'components/forward-link';

const NameTD = ({
  row: collection,
}) => (
  <td className="main">
    <Link
      href={`/myrw-detail/collections/${collection.id}`}
      passHref
    >
      <ForwardLink>
        {collection.name}
      </ForwardLink>
    </Link>
  </td>
);

NameTD.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default NameTD;
