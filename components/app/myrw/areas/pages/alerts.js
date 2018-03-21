import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// Components
import Map from 'components/ui/map/Map';

const MAP_CONFIG = {
  zoom: 3,
  latLng: {
    lat: 0,
    lng: 0
  },
  zoomControl: false
};

function AreasAlerts(props) {
  const { user } = props;
  console.log(user);

  return (
    <div className="c-areas-alerts">

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
  id: PropTypes.string
};

export default AreasAlerts;
