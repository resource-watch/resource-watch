import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

import { toggleModal, setModalOptions } from 'redactions/modal';
import { toggleTooltip } from 'redactions/tooltip';

import { connect } from 'react-redux';

// Selectors
import areaAlerts from 'selectors/user/areaAlerts';

// Components
import AlertWidget from 'components/areas/AlertWidget';
import AreaSubscriptionModal from 'components/modal/AreaSubscriptionModal';

class AreasAlerts extends React.Component  {

  constructor(props) {
    super(props);
    const { user, id } = props;
    const { subscription } = user.areas.items.find(alert => alert.id === id);
    const { areas } = user;

    this.state = {
      area: areas.items.find(a => a.id === id),
      subscription
    };
  }

  handleEditSubscription() {
    const mode = this.state.subscription ? 'edit' : 'new';
    const options = {
      children: AreaSubscriptionModal,
      childrenProps: {
        area: this.state.area,
        toggleModal: this.props.toggleModal,
        onSubscriptionUpdated: this.handleSubscriptionUpdated,
        onSubscriptionCreated: this.handleSubscriptionUpdated,
        mode,
        subscriptionDataset: true,
        subscriptionType: true,
        subscriptionThreshold: true
      }
    };
    this.props.toggleModal(true);
    this.props.setModalOptions(options);
  }

  render() {
    const { user, id, alerts } = this.props;
    const { subscription } = user.areas.items.find(alert => alert.id === id);

    return (
      <div className="c-alerts-page">
        <button
            className="c-btn -b -compressed"
            onClick={() => this.handleEditSubscription()}
          >
            Edit Subscriptions
          </button>

        {subscription && subscription.attributes && subscription.attributes.datasets &&
          subscription.attributes.datasets.map((dataset, key) =>
            <AlertWidget key={key} dataset={dataset} layerGroup={id} subscription={subscription} />)}

        <p>
          This notification reports {alerts[id].map(a => a.dataset.label).join(', ')} for the area of interest you subscribed to.
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
}

AreasAlerts.propTypes = {
  id: PropTypes.string,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  alerts: areaAlerts(state)
});

const mapDispatchToProps = {
  toggleModal,
  setModalOptions,
  toggleTooltip
};

export default connect(mapStateToProps, mapDispatchToProps)(AreasAlerts);
