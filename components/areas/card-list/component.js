import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'routes';

// components
import InView from 'components/in-view';
import AreaCard from '../card';

// styles
import './styles.scss';

const AreaCardList = ({ areas, className, query }) => {
  const componentClass = classnames({
    'c-areas-list': true,
    [className]: !!className
  });

  const {
    openModal: openSubscriptionsModal,
    subscriptionDataset,
    subscriptionType,
    subscriptionThreshold
  } = query;

  return (
    <div className={componentClass}>
      <div className="row">
        {areas.map(area => (
          <div
            key={area.id}
            className="column small-12 medium-4"
          >
            <InView
              triggerOnce
              threshold={0.35}
            >
              {({ ref, inView }) => (
                <div
                  ref={ref}
                  className="card-container"
                >
                  {inView && (
                    <AreaCard
                      area={area}
                      openSubscriptionsModal={
                        openSubscriptionsModal && openSubscriptionsModal === area.id
                      }
                      subscriptionDataset={
                        openSubscriptionsModal &&
                        openSubscriptionsModal === area.id &&
                        subscriptionDataset
                      }
                      subscriptionThreshold={
                        openSubscriptionsModal &&
                        openSubscriptionsModal === area.id &&
                        subscriptionThreshold
                      }
                      subscriptionType={
                        openSubscriptionsModal && openSubscriptionsModal === area.id && subscriptionType
                      }
                    />
                  )}
                </div>
              )}
            </InView>
          </div>
        ))}

        {areas.length !== 0 && (
          <div className="column small-12 medium-4">
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

        {areas.items.length === 0 && (
          <div className="no-areas-container">
            <p>Create an area of interest to sign up for alerts.</p>
          </div>
        )}
      </div>
    </div>
  );
};

AreaCardList.propTypes = {
  areas: PropTypes.array.isRequired,
  query: PropTypes.object,
  className: PropTypes.string
};

AreaCardList.defaultProps = {
  query: {},
  className: null
};

export default AreaCardList;
