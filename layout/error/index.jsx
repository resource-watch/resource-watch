import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

export default function LayoutError({
  statusCode,
  description,
}) {
  return (
    <main className="l-error">
      <div className="container">
        <h1>{statusCode}</h1>
        <p>{description}</p>
        <Link href="/">
          <a className="c-button -primary">
            Go to Resource Watch
          </a>
        </Link>
      </div>
    </main>
  );
}

LayoutError.defaultProps = {
  description: 'Something went wrong',
};

LayoutError.propTypes = {
  statusCode: PropTypes.number.isRequired,
  description: PropTypes.string,
};
