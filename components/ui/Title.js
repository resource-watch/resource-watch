import React from 'react';

export default function Title({ children, className }) {
  return (
    <div className={`c-title ${className || ''}`}>
      {children}
    </div>
  );
}

Title.propTypes = {
  children: React.PropTypes.any,
  className: React.PropTypes.string
};
