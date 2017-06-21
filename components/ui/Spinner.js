import React from 'react';

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
  isLoading: React.PropTypes.bool,
  className: React.PropTypes.string,
  style: React.PropTypes.object
};

export default Spinner;
