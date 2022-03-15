import PropTypes from 'prop-types';
import classnames from 'classnames';

// components
import Icon from 'components/ui/icon';

export default function CardIndicator({
  id,
  icon,
  title,
  onClickCard,
  theme,
  isSelected,
  className,
}) {
  return (
    <button
      type="button"
      className={classnames(
        'c-indicator-card-set h-[110px] w-[110px] md:h-[195px] md:w-[195px] lg:h-[155px] lg:w-[155px] xl:h-[160px] xl:w-[160px] p-1 md:p-2',
        {
          'c-indicator-card-set': true,
          [`-${theme}`]: !!theme,
          '-active': isSelected,
          [className]: Boolean(className),
        },
      )}
      id={id}
      data-title={title}
      onClick={() => {
        if (onClickCard) onClickCard(id);
      }}
    >
      <Icon name={`icon-${icon}`} />
      <span className="inline-block text-sm leading-4 card-title md:text-base md:leading-5">
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
