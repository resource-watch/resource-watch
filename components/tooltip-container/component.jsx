import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function TooltipContainer({
  style,
  children,
  direction,
}) {
  return (
    <div
      className={classnames('c-tooltip-container', {
        '-direction-down': direction === 'down',
        '-direction-up': direction === 'up',
      })}
      style={style}
    >
      {children}
    </div>
  );
}

TooltipContainer.defaultProps = {
  direction: 'down',
  style: {},
};

TooltipContainer.propTypes = {
  style: PropTypes.shape({}),
  children: PropTypes.node.isRequired,
  direction: PropTypes.oneOf([
    'up',
    'down',
  ]),
};
