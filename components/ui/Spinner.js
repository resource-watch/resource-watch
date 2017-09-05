import React from 'react';
import PropTypes from 'prop-types';

function Spinner({ isLoading, className, style }) {
  const loading = (isLoading) ? '-loading' : '';
  return (
    <div className={`c-spinner ${loading} ${className}`}>
      <div className="spinner-box" style={style}>
        <div className="icon" />
      </div>
    </div>
  );
}

Spinner.propTypes = {
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object
};

export default Spinner;
