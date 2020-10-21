import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// components
import InView from 'components/in-view';
import AreaCard from '../card';

// styles
import './styles.scss';

const AreaCardList = ({
  areas,
  className,
  isColumn,
  enableSubscriptions,
  onMapView,
  onEditArea,
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
                    height: isColumn ? 325 : 390,
                    width: isColumn ? 300 : 'auto',
                  }}
                >
                  {inView && (
                    <AreaCard
                      area={area}
                      enableSubscriptions={enableSubscriptions}
                      onMapView={onMapView}
                      onDeletionArea={onDeletionArea}
                      onEditArea={onEditArea}
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
  enableSubscriptions: true,
};

AreaCardList.propTypes = {
  areas: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
  className: PropTypes.string,
  isColumn: PropTypes.bool,
  enableSubscriptions: PropTypes.bool,
  onMapView: PropTypes.func.isRequired,
  onEditArea: PropTypes.func.isRequired,
  onDeletionArea: PropTypes.func.isRequired,
};

export default AreaCardList;
