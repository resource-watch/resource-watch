import {
  useState,
  useMemo,
  useCallback,
  cloneElement,
  isValidElement,
} from 'react';
import PropTypes from 'prop-types';

// components
import IndicatorVisualization from './indicator-visualization';

// styles
import './styles.scss';

export default function CardIndicatorSet({
  config: {
    indicators,
  },
  params,
  theme,
  children,
}) {
  const defaultIndicator = useMemo(
    () => indicators.find(({ default: isDefault }) => isDefault) || indicators?.[0],
    [indicators],
  );
  const [currentIndicator, setIndicator] = useState(defaultIndicator || null);
  const handleClickCard = useCallback((idSelected) => {
    setIndicator(indicators.find(({ id }) => idSelected === id));
  }, [indicators]);

  return (
    <div className="c-card-indicator-set">
      <div
        className="card-indicators-container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {children.map((child) => {
          if (!isValidElement(child)) return null;
          const isSelected = currentIndicator.id === child.props.id;

          const childWithProps = cloneElement(child, ({
            onClickCard: handleClickCard,
            isSelected,
          }));

          return (
            isSelected ? (
              <div
                key={child.props.id}
                className={`selected-card -${theme}`}
              >
                {childWithProps}
              </div>
            ) : (
              childWithProps
            )
          );
        })}
      </div>
      {currentIndicator && (
        <IndicatorVisualization
          indicator={currentIndicator}
          theme={theme}
          params={params}
        />
      )}
    </div>
  );
}

CardIndicatorSet.defaultProps = {
  theme: 'primary',
  params: null,
};

CardIndicatorSet.propTypes = {
  config: PropTypes.shape({
    indicators: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(
      PropTypes.element,
    ),
  ]).isRequired,
  theme: PropTypes.oneOf(['primary', 'secondary']),
  params: PropTypes.shape({}),
};
