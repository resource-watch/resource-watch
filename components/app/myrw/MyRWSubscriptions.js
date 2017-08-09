import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux
import { connect } from 'react-redux';
import { toggleModal, setModalOptions } from 'redactions/modal';

// Services
import UserService from 'services/UserService';

// Components
import Spinner from 'components/ui/Spinner';
import SubscriptionCard from 'components/app/myrw/subscriptions/SubscriptionCard';
import SubscribeToDatasetModal from 'components/modal/SubscribeToDatasetModal';


class MyRWSubscriptions extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      subscriptions: []
    };

    this.userService = new UserService({ apiURL: process.env.WRI_API_URL });
  }

  componentDidMount() {
    if (!this.props.user.id) {
      this.waitForUserToBeLoaded();
    } else {
      this.loadSubscriptions();
    }
  }

  waitForUserToBeLoaded() {
    setTimeout(() => {
      if (this.props.user.id) {
        this.loadSubscriptions();
      } else {
        this.waitForUserToBeLoaded();
      }
    }, 400);
  }

  loadSubscriptions() {
    this.setState({
      loading: true
    });
    this.userService.getSubscriptions(this.props.user.token)
      .then((data) => {
        this.setState({
          subscriptions: data,
          loading: false
        });
      })
      .catch((err) => {
        this.setState({
          error: err,
          loading: false
        });
      });
  }

  @Autobind
  handleSubscriptionRemoved() {
    this.loadSubscriptions();
  }

  @Autobind
  handleNewSubscription() {
    const options = {
      children: SubscribeToDatasetModal,
      childrenProps: {
        toggleModal: this.props.toggleModal,
        showDatasetSelector: true
      }
    };
    this.props.toggleModal(true);
    this.props.setModalOptions(options);
  }

  render() {
    const { loading, subscriptions } = this.state;
    const { user } = this.props;

    return (
      <div className="c-page-section c-myrw-subscriptions">
        <div className="l-container">
          <Spinner isLoading={loading} className="-small -light" />
          <div className="actions-div">
            <a
              onClick={this.handleNewSubscription}
              role="button"
              tabIndex={-1}
            >
              New Subscription
            </a>
          </div>
          <div className="row">
            {subscriptions && subscriptions.map(val =>
              (
                <div
                  className="card-container"
                  key={val.id}
                >
                  <SubscriptionCard
                    token={user.token}
                    subscription={val}
                    onSubscriptionRemoved={this.handleSubscriptionRemoved}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  }
}

MyRWSubscriptions.propTypes = {
  // Store
  user: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired,
  setModalOptions: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  toggleModal: (open) => { dispatch(toggleModal(open)); },
  setModalOptions: (options) => { dispatch(setModalOptions(options)); }
});

export default connect(mapStateToProps, mapDispatchToProps)(MyRWSubscriptions);
