import React, { useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// styles
import './styles.scss';

const ProminentButton = ({
  isLink,
  onClick,
  className,
  children,
}) => {
  const buttonRef = useRef(null);
  const handleEscapeKey = useCallback((e) => {
    if (e.key !== 'Escape') return null;
    return buttonRef.current.blur();
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleEscapeKey);
    return () => { window.removeEventListener('keydown', handleEscapeKey); };
  }, [handleEscapeKey]);

  return (
    <button
      ref={buttonRef}
      type="button"
      className={classnames('c-prominent-button', {
        [className]: !!className,
        '-is-link': isLink,
      })}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

ProminentButton.defaultProps = {
  onClick: () => {},
  isLink: false,
  className: null,
};

ProminentButton.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.element,
    ),
    PropTypes.element,
  ]).isRequired,
  isLink: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default ProminentButton;
