import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

export default function NameTD({
  row,
  value,
}) {
  return (
    <td
      key={row.id}
      className="main"
    >
      <Link href={`/admin/pages/pages/${row.id}`}>
        <a>{value}</a>
      </Link>
    </td>
  );
}

NameTD.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  value: PropTypes.string.isRequired,
};
