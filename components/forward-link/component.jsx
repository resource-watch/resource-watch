import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const ForwardLink = forwardRef(({
  href,
  children,
  ...restProps
}, ref) => (
  <a
    href={href}
    ref={ref}
    {...restProps}
  >
    {children}
  </a>
));

ForwardLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.arrayOf(
      PropTypes.element,
    ),
  ]).isRequired,
};

export default ForwardLink;
