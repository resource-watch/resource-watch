import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// Redux
import { connect } from 'react-redux';

// Components
import Spinner from 'components/ui/Spinner';
import AreaCard from 'components/areas/AreaCard';

class AreasList extends React.Component {
  constructor(props) {
    super(props);
    const { query } = props.routes;
    const { openModal, subscriptionThreshold, subscriptionDataset, subscriptionType } = query || {};

    this.state = {
      loading: false,
      openSubscriptionsModal: openModal,
      subscriptionThreshold,
      subscriptionDataset,
      subscriptionType
    };
  }

  render() {
    const {
      loading,
      openSubscriptionsModal,
      subscriptionDataset,
      subscriptionType,
      subscriptionThreshold
    } = this.state;

    const { user } = this.props;
    const { areas } = user;

    return (
      <div className="c-areas-list">
        <Spinner isLoading={loading} className="-small -light" />
        <div className="actions-div">
          <Link route="myrw_detail" params={{ id: 'new', tab: 'areas' }}>
            <a className="c-button -secondary">New area</a>
          </Link>
        </div>
        <div className="row">
          {areas.items.map(area => (
            <div key={area.id} className="column small-12 medium-4">
              <div className="card-container">
                <AreaCard
                  token={user.token}
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
              </div>
            </div>
          ))}

          {areas.items.length !== 0 && (
            <Link route="myrw_detail" params={{ id: 'new', tab: 'areas' }}>
              <div className="column small-12 medium-4 c-area-card--add-card">
                <a>
                  <span>New Area</span>
                </a>
              </div>
            </Link>
          )}

          {areas.items.length === 0 && (
            <div className="no-areas-container">
              <p>Create an area of interest to sign up for alerts.</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

AreasList.propTypes = {
  user: PropTypes.object.isRequired,
  routes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  locale: state.common.locale,
  routes: state.routes
});

export default connect(
  mapStateToProps,
  null
)(AreasList);
