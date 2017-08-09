import React from 'react';

// Components
import SubscriptionsList from 'components/subscriptions/SubscriptionsList';

function SubscriptionsIndex() {
  return (
    <div className="c-subscriptions-index">
      <SubscriptionsList
        application={[process.env.APPLICATIONS]}
        routes={{
          index: 'myrw',
          detail: 'myrw_detail'
        }}
      />
    </div>
  );
}

export default SubscriptionsIndex;
