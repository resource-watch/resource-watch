import React from 'react';
import PropTypes from 'prop-types';

// Components
import SubscriptionsList from 'components/subscriptions/SubscriptionsList';

function SubscriptionsIndex(props) {
  return (
    <div className="c-subscriptions-index">
      <SubscriptionsList />
    </div>
  );
}

SubscriptionsIndex.propTypes = {
  user: PropTypes.object
};

export default SubscriptionsIndex;
