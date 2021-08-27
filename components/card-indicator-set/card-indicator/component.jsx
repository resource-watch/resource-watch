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
        'c-indicator-card-set': true,
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
  theme: 'primary',
};

CardIndicator.propTypes = {
  id: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  theme: PropTypes.oneOf(['primary', 'secondary']),
  isSelected: PropTypes.bool,
  onClickCard: PropTypes.func,
};
