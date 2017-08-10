import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import { Link } from 'routes';

// Redux
import { connect } from 'react-redux';

// Services
import UserService from 'services/UserService';

// Components
import Spinner from 'components/ui/Spinner';
import SubscriptionCard from 'components/subscriptions/SubscriptionCard';

class SubscriptionsList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      subscriptions: []
    };

    this.userService = new UserService({ apiURL: process.env.WRI_API_URL });
  }

  componentDidMount() {
    this.loadSubscriptions();
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

  render() {
    const { loading, subscriptions } = this.state;
    const { user } = this.props;

    return (
      <div className="c-page-section c-myrw-subscriptions">
        <div className="l-container">
          <Spinner isLoading={loading} className="-small -light" />
          <div className="actions-div">
            <Link route="myrw_detail" params={{ id: 'new', tab: 'areas' }}>
              <a>
                New
              </a>
            </Link>
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

SubscriptionsList.propTypes = {
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(SubscriptionsList);
