import React from 'react';
import PropTypes from 'prop-types';

// components
import Icon from 'components/ui/icon';

// styles
import './styles.scss';

const ProminentButton = ({
  icon,
  text,
  onClick,
}) => (
  <button
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

ProminentButton.defaultProps = {
  onClick: () => {},
};

ProminentButton.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default ProminentButton;
