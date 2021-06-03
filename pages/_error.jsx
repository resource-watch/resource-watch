import React from 'react';
import PropTypes from 'prop-types';

// components
import HeadError from 'layout/head/error';
import LayoutError from 'layout/error';

function ErrorPage({
  statusCode,
}) {
  return (
    <>
      <HeadError />
      <LayoutError statusCode={statusCode} />
    </>
  );
}

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res?.statusCode || err?.statusCode || 500;

  return {
    statusCode,
  };
};

ErrorPage.propTypes = {
  statusCode: PropTypes.number.isRequired,
};

export default ErrorPage;
