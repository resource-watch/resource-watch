import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// Components
import AlertWidget from 'components/areas/AlertWidget';

function AreasAlerts(props) {
  const { user, id } = props;
  const { subscription } = user.areas.items.find(alert => alert.id === id);

  // console.log('subscription found', subscription);

  return (
    <div className="c-areas-alerts">

      {subscription && subscription.attributes &&
        subscription.attributes.datasets.map(dataset =>
          <AlertWidget key={dataset.id} dataset={dataset} />)}

      <p>
        This notification reports {'<'}type of alert(s){'>'} for the area of interest you subscribed to.
        You will receive a separate email for each area and each alert you subscribe to.
        Date of alerts refers to the date range within which change was detected.
        There may be a lag between detection and when you receive this notification.
      </p>

      <p>
        For questions or if you would like more information,
        please email: [resourcewatch@wri.org]
      </p>

      <p>
        Please note that this information is subject to the <Link route="terms-of-service">
          <a>Resource Watch Terms of Service</a></Link>.
        You can unsubscribe or manage your subscriptions at
        <Link route="myrw" params={{ tab: 'areas' }}><a> My Resource Watch</a>
        </Link> [my resource watch aoi page].
      </p>

    </div>
  );
}


AreasAlerts.propTypes = {
  id: PropTypes.string,
  user: PropTypes.object.isRequired
};

export default AreasAlerts;
