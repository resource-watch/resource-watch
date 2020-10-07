import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'routes';

// components
import InView from 'components/in-view';
import AreaCard from '../card';

// styles
import './styles.scss';

const AreaCardList = ({
  areas,
  className,
  isColumn,
  showNewArea,
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
                  }}
                >
                  {inView && (
                    <AreaCard
                      area={area}
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

        {(areas.length !== 0 && showNewArea) && (
          <div className={classnames({ 'column small-12 medium-4': !isColumn })}>
            <div className="card-container">
              <div className="new-area-card">
                <Link
                  route="myrw_detail"
                  params={{ id: 'new', tab: 'areas' }}
                >
                  <a>
                    <span>New Area</span>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        )}

        {areas.length === 0 && (
          <div className="no-areas-container">
            <p>Create an area of interest to sign up for alerts.</p>
          </div>
        )}
      </div>
    </div>
  );
};

AreaCardList.defaultProps = {
  className: null,
  isColumn: false,
  showNewArea: true,
  onMapView: () => {},
  onEditArea: null,
  onDeletionArea: () => {},
};

AreaCardList.propTypes = {
  areas: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
  className: PropTypes.string,
  isColumn: PropTypes.bool,
  showNewArea: PropTypes.bool,
  onMapView: PropTypes.func,
  onEditArea: PropTypes.func,
  onDeletionArea: PropTypes.func,
};

export default AreaCardList;
