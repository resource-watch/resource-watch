import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// styles
import './styles.scss';

const Icon = ({
  name,
  className,
  style,
}) => (
  <svg
    className={classnames('c-icon', { [className]: !!className })}
    {...style && { style }}
  >
    <use xlinkHref={`#${name}`} />
  </svg>
);

Icon.defaultProps = {
  className: null,
  style: {},
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.shape({}),
};

export default Icon;
