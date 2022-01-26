import {
  cloneElement,
  isValidElement,
} from 'react';
import PropTypes from 'prop-types';

// components
import IndicatorVisualization from './indicator-visualization';

export default function CardIndicatorSet({
  indicator,
  params,
  theme,
  RWAdapter,
  children,
  isInACollection,
  handleClickCard,
}) {
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
          const isSelected = indicator.id === child.props.id;

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
      {indicator && (
        <IndicatorVisualization
          indicator={indicator}
          theme={theme}
          params={params}
          isInACollection={isInACollection}
          RWAdapter={RWAdapter}
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
  indicator: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.string,
  }).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(
      PropTypes.element,
    ),
  ]).isRequired,
  theme: PropTypes.oneOf(['primary', 'secondary']),
  params: PropTypes.shape({}),
  isInACollection: PropTypes.bool.isRequired,
  handleClickCard: PropTypes.func.isRequired,
  RWAdapter: PropTypes.func.isRequired,
};
