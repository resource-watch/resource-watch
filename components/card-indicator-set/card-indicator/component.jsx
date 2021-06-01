import PropTypes from 'prop-types';
import classnames from 'classnames';

// components
import Icon from 'components/ui/icon';

// styles
import './styles.scss';

export default function CardIndicator({
  id,
  icon,
  title,
  onClickCard,
  theme,
  isSelected,
}) {
  return (
    <button
      type="button"
      className={classnames({
        'c-indicator-card': true,
        [`-${theme}`]: !!theme,
        '-active': isSelected,
      })}
      onClick={() => {
        if (onClickCard) onClickCard(id);
      }}
    >
      <Icon name={`icon-${icon}`} />
      <span className="card-title">
        {title}
      </span>
    </button>
  );
}

CardIndicator.defaultProps = {
  isSelected: false,
  onClickCard: null,
};

CardIndicator.propTypes = {
  id: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  theme: PropTypes.oneOf(['primary', 'secondary']).isRequired,
  isSelected: PropTypes.bool,
  onClickCard: PropTypes.func,
};
