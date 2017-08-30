import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';

// Services
import AreasService from 'services/AreasService';
import UserService from 'services/UserService';
import DatasetService from 'services/DatasetService';

// Components
import Spinner from 'components/ui/Spinner';
import SubscriptionSelector from 'components/subscriptions/SubscriptionSelector';

class AreaSubscriptionModal extends React.Component {
  constructor(props) {
    super(props);
    const subscription = props.area.subscription;
    const initialSubscriptionSelectors = subscription
      ? subscription.attributes.datasetsQuery.map((elem, index) =>
        ({ index, selectedDataset: elem.id, selectedType: elem.type }))
      : [{ index: 0, selectedDataset: null, selectedType: null }];

    this.state = {
      loadingDatasets: false,
      loading: false,
      datasets: [],
      subscriptionSelectors: initialSubscriptionSelectors
    };

    // Services
    this.datasetService = new DatasetService(null, { apiURL: process.env.WRI_API_URL });
    this.areasService = new AreasService({ apiURL: process.env.WRI_API_URL });
    this.userService = new UserService({ apiURL: process.env.WRI_API_URL });
  }

  componentDidMount() {
    this.loadDatasets();
  }

  @Autobind
  handleCancel() {
    this.setState({
      saved: false
    });
    this.props.toggleModal(false);
  }


  @Autobind
  handleSubmit() {
    const { subscriptionSelectors } = this.state;
    const { mode, area, user } = this.props;
    let incomplete = false;
    subscriptionSelectors.forEach((val) => {
      if (!val.selectedType || !val.selectedDataset) {
        incomplete = true;
      }
    });

    if (incomplete) {
      toastr.error('Data missing', 'Please select a dataset and a subscription type for all items');
    } else {
      const datasets = subscriptionSelectors.map(val => val.selectedDataset);
      const datasetsQuery = subscriptionSelectors
        .map(val => ({ id: val.selectedDataset, type: val.selectedType }));

      if (mode === 'new') {
        this.userService.createSubscriptionToArea(area.id, datasets, datasetsQuery, user)
          .then(() => {
            toastr.success('Success!', 'Subscription created successfully');
            this.props.toggleModal(false);
            this.props.onSubscriptionCreated();
          })
          .catch(err => toastr.error('Error creating the subscription', err));
      } else if (mode === 'edit') {
        this.userService.updateSubscriptionToArea(area.id, datasets, datasetsQuery, user)
          .then(() => {
            toastr.success('Success!', 'Subscription updated successfully');
            this.props.toggleModal(false);
            this.props.onSubscriptionUpdated();
          })
          .catch(err => toastr.error('Error updating the subscription', err));
      }
    }
  }

  loadDatasets() {
    this.datasetService.getSubscribableDatasets().then((response) => {
      this.setState({
        loadingDatasets: false,
        datasets: response.filter(val => val.attributes.subscribable)
      });
    }).catch(err => console.error(err)); // TODO: update the UI
  }

  @Autobind
  handleRemoveSubscriptionSelector(index) {
    const { subscriptionSelectors } = this.state;
    if (subscriptionSelectors.length > 1) {
      subscriptionSelectors.splice(index, 1);
      this.setState({ subscriptionSelectors });
    }
  }

  @Autobind
  handleUpdateSubscriptionSelector(element) {
    const { subscriptionSelectors } = this.state;
    subscriptionSelectors[element.index] = element;
    this.setState({ subscriptionSelectors });
  }

  @Autobind
  handleNewSubscriptionSelector() {
    const { subscriptionSelectors } = this.state;
    subscriptionSelectors.push({ index: subscriptionSelectors.length, dataset: null, type: null });

    this.setState({
      subscriptionSelectors
    });
  }

  render() {
    const {
      datasets,
      loading,
      loadingDatasets,
      subscriptionSelectors
    } = this.state;
    const { area } = this.props;

    return (
      <div className="c-area-subscription-modal" ref={(node) => { this.el = node; }}>
        <div className="header-div">
          <h2>{`${area.attributes.name} subscriptions`}</h2>
        </div>
        <Spinner isLoading={loading || loadingDatasets} className="-light" />
        <div className="new-container">
          <button className="c-btn -primary" onClick={this.handleNewSubscriptionSelector}>
            Add dataset
          </button>
        </div>
        <div className="datasets-container">
          {subscriptionSelectors.map((val, index) =>
            (<SubscriptionSelector
              datasets={datasets}
              data={val}
              onRemove={this.handleRemoveSubscriptionSelector}
              onUpdate={this.handleUpdateSubscriptionSelector}
              index={index}
            />)
          )}
        </div>
        <div className="buttons">
          <button className="c-btn -primary" onClick={this.handleSubmit}>
            Submit
          </button>
          <button className="c-btn -secondary" onClick={this.handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    );
  }
}

AreaSubscriptionModal.propTypes = {
  area: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired, // edit | new
  // Store
  user: PropTypes.object.isRequired,
  // Callbacks
  onSubscriptionCreated: PropTypes.func,
  onSubscriptionUpdated: PropTypes.func
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(AreaSubscriptionModal);
