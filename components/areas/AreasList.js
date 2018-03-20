import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';

// Services
import UserService from 'services/UserService';
import DatasetService from 'services/DatasetService';

// Components
import Spinner from 'components/ui/Spinner';
import AreaCard from 'components/areas/AreaCard';

class AreasList extends React.Component {
  constructor(props) {
    super(props);
    const { query } = props.routes;
    const {
      openModal,
      subscriptionThreshold,
      subscriptionDataset,
      subscriptionType
    } = query || {};

    this.state = {
      loading: false,
      openSubscriptionsModal: openModal,
      subscriptionThreshold,
      subscriptionDataset,
      subscriptionType
    };

    this.userService = new UserService({ apiURL: process.env.WRI_API_URL });

    // ------------------- Bindings -----------------------
    this.handleAreaRemoved = this.handleAreaRemoved.bind(this);
    // ----------------------------------------------------
  }

  // TODO : Area removed redux call
  handleAreaRemoved() {
    // this.loadData();
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
        <div className="l-container">
          <Spinner isLoading={loading} className="-small -light" />
          <div className="actions-div">
            <Link route="myrw_detail" params={{ id: 'new', tab: 'areas' }}>
              <a className="c-button -secondary">
                New area
              </a>
            </Link>
          </div>
          <div className="row">
            {areas.items.map(val =>
              (
                <div key={val.id} className="column small-12 medium-4">
                  <div
                    className="card-container"
                  >
                    <AreaCard
                      token={user.token}
                      area={val}
                      onAreaRemoved={this.handleAreaRemoved}
                      onChange={() => this.loadData()}
                      openSubscriptionsModal={openSubscriptionsModal &&
                        openSubscriptionsModal === val.id}
                      subscriptionDataset={openSubscriptionsModal &&
                        openSubscriptionsModal === val.id && subscriptionDataset}
                      subscriptionThreshold={openSubscriptionsModal &&
                        openSubscriptionsModal === val.id && subscriptionThreshold}
                      subscriptionType={openSubscriptionsModal &&
                        openSubscriptionsModal === val.id && subscriptionType}
                    />
                  </div>
                </div>
              )
            )}

            <Link route="myrw_detail" params={{ id: 'new', tab: 'areas' }}>
              <div className="column small-12 medium-4 c-area-card--add-card">
                <a>
                  <span>New Area</span>
                </a>
              </div>
            </Link>

            { areas.items.length === 0 &&
              <div className="no-areas-container">
                <p>You have not created any areas yet</p>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

AreasList.propTypes = {
  user: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  routes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  locale: state.common.locale,
  routes: state.routes
});

export default connect(mapStateToProps, null)(AreasList);
