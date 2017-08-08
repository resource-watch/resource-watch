import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Components
import Spinner from 'components/ui/Spinner';

// Services
import DatasetService from 'services/DatasetService';
import AreasService from 'services/AreasService';
import UserService from 'services/UserService';

class SubscriptionCard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      dataset: null,
      country: null
    };

    // Services
    this.datasetService = new DatasetService(props.subscription.attributes.datasets[0],
      { apiURL: process.env.WRI_API_URL });
    this.areasService = new AreasService({ apiURL: process.env.WRI_API_URL });
    this.userService = new UserService({ apiURL: process.env.WRI_API_URL });
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.setState({ loading: true });
    this.datasetService.fetchData()
    .then((response) => {
      this.setState({ dataset: response });
      this.areasService.getCountry(this.props.subscription.attributes.params.iso.country)
      .then((res) => {
        this.setState({
          loading: false,
          country: res.data[0].label
        });
      })
    })
    .catch(err => console.log(err));
  }

  @Autobind
  handleDeleteSubscription() {
    const { subscription, token } = this.props;

    if (confirm('Are you sure you want to delete the subscription?')) {
      this.setState({ loading: true });
      this.userService.deleteSubscription(subscription.id, token)
        .then((response) => {
          this.props.onSubscriptionRemoved();
        })
        .catch((err) => console.log(err));
    }
  }

  render() {
    const { loading, dataset, country } = this.state;
    const { subscription } = this.props;

    return (
      <div className="c-subscription-card medium-4 small-12">
        <Spinner isLoading={loading} className="-small -light -relative -center" />
        { name &&
          <div className="name-container">
            <h4>{subscription.attributes.ame}</h4>
          </div>
        }
        <div className="data-container">
          <div className="location-container">
            <h5>Location</h5>
            {country}
          </div>
          <div className="dataset-container">
            <h5>Dataset</h5>
            {dataset && dataset.attributes.name}
          </div>
        </div>
        <div className="actions-div">
          <a
            tabIndex={-1}
            role="button"
            onClick={this.handleDeleteSubscription}
          >
            Delete
          </a>
        </div>
      </div>
    );
  }

}

SubscriptionCard.propTypes = {
  token: PropTypes.string.isRequired,
  subscription: PropTypes.object.isRequired,
  // Callbacks
  onSubscriptionRemoved: PropTypes.func.isRequired
};

export default SubscriptionCard;
