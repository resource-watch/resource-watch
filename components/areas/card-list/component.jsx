import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// components
import InView from 'components/in-view';
import AreaCard from '../card';

const AreaCardList = ({
  areas,
  className,
  isColumn,
  showSubscriptions,
  onMapView,
  onEditArea,
  onChangedVisibility,
  onDeletionArea,
}) => {
  const componentClass = classnames({
    'c-areas-list': true,
    [className]: !!className,
  });

  return (
    <div className={componentClass}>
      <div className={classnames({ row: !isColumn })}>
        {areas.map((area) => (
          <div
            key={area.id}
            className={classnames({ 'column small-12 medium-4': !isColumn })}
          >
            <InView
              triggerOnce
              threshold={0.25}
            >
              {({ ref, inView }) => (
                <div
                  ref={ref}
                  className="card-container"
                  style={{
                    height: isColumn ? 335 : 390,
                    width: isColumn ? 300 : 'auto',
                  }}
                >
                  {inView && (
                    <AreaCard
                      area={area}
                      showSubscriptions={showSubscriptions}
                      onMapView={onMapView}
                      onEditArea={onEditArea}
                      onChangedVisibility={onChangedVisibility}
                      onDeletionArea={onDeletionArea}
                    />
                  )}
                </div>
              )}
            </InView>
          </div>
        ))}

        {!areas.length && (
          <div className="no-areas-container">
            There are no areas to display. Try creating a new one.
          </div>
        )}
      </div>
    </div>
  );
};

AreaCardList.defaultProps = {
  className: null,
  isColumn: false,
  showSubscriptions: true,
  onEditArea: null,
};

AreaCardList.propTypes = {
  areas: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
  className: PropTypes.string,
  isColumn: PropTypes.bool,
  showSubscriptions: PropTypes.bool,
  onMapView: PropTypes.func.isRequired,
  onEditArea: PropTypes.func,
  onChangedVisibility: PropTypes.func.isRequired,
  onDeletionArea: PropTypes.func.isRequired,
};

export default AreaCardList;
