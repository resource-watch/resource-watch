import React from 'react';

// Components
import SubscriptionsForm from 'components/subscriptions/SubscriptionsForm';

function SubscriptionsNew() {
  return (
    <div className="c-subscriptions-index">
      <SubscriptionsForm
        application={[process.env.APPLICATIONS]}
        routes={{
          index: 'myrw',
          detail: 'myrw_detail'
        }}
      />
    </div>
  );
}

export default SubscriptionsNew;
