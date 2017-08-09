import React from 'react';
import PropTypes from 'prop-types';

// Components
import SubscriptionsList from 'components/subscriptions/SubscriptionsList';

function SubscriptionsIndex(props) {
  return (
    <div className="c-subscriptions-index">
      <SubscriptionsList
        application={[process.env.APPLICATIONS]}
        user={props.user}
        routes={{
          index: 'myrw',
          detail: 'myrw_detail'
        }}
      />
    </div>
  );
}

SubscriptionsIndex.propTypes = {
  user: PropTypes.object
};

export default SubscriptionsIndex;
