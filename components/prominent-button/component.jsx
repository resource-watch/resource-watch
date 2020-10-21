import React, { useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

// components
import Icon from 'components/ui/icon';

// styles
import './styles.scss';

const ProminentButton = ({
  icon,
  text,
  onClick,
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
      className="c-prominent-button"
      onClick={onClick}
    >
      <Icon name={`icon-${icon}`} />
      <span>
        {text}
      </span>
    </button>
  );
};

ProminentButton.defaultProps = {
  onClick: () => {},
};

ProminentButton.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default ProminentButton;
