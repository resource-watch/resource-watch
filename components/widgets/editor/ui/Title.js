import React from 'react';
import PropTypes from 'prop-types';

export default function Title({ children, className }) {
  return (
    <div className={`c-title ${className || ''}`}>
      {children}
    </div>
  );
}

Title.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string
};
