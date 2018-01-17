import React from 'react';
import PropTypes from 'prop-types';
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

// Utils
import { logEvent } from 'utils/analytics';

class AreaSubscriptionModal extends React.Component {
  constructor(props) {
    super(props);
    const { subscriptionDataset, subscriptionType, subscriptionThreshold } = props;
    const subscription = props.area.subscription;
    const initialSubscriptionSelectors = subscription
      ? subscription.attributes.datasetsQuery.map((elem, index) =>
        ({ index,
          selectedDataset: elem.id,
          selectedType: elem.type,
          selectedThreshold: elem.threshold }))
      : [{ index: 0, selectedDataset: null, selectedType: null, selectedThreshold: 1 }];

    if (subscriptionDataset) {
      const selectorFound = initialSubscriptionSelectors
        .find(selector => selector.selectedDataset === subscriptionDataset);
      if (selectorFound) {
        selectorFound.selectedType = subscriptionType;
        selectorFound.selectedThreshold = subscriptionThreshold;
      } else if (subscription) {
        initialSubscriptionSelectors.push({
          index: initialSubscriptionSelectors.length,
          selectedDataset: subscriptionDataset,
          selectedType: subscriptionType,
          selectedThreshold: subscriptionThreshold
        });
      } else {
        initialSubscriptionSelectors[0].selectedType = subscriptionType;
        initialSubscriptionSelectors[0].selectedThreshold = subscriptionThreshold || 1;
        initialSubscriptionSelectors[0].selectedDataset = subscriptionDataset;
      }
    }

    this.state = {
      loadingDatasets: false,
      loading: false,
      datasets: [],
      subscriptionSelectors: initialSubscriptionSelectors
    };

    // Services
    this.datasetService = new DatasetService(null, {
      apiURL: process.env.WRI_API_URL,
      language: props.locale
    });
    this.areasService = new AreasService({ apiURL: process.env.WRI_API_URL });
    this.userService = new UserService({ apiURL: process.env.WRI_API_URL });

    // ------------------- Bindings -----------------------
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRemoveSubscriptionSelector = this.handleRemoveSubscriptionSelector.bind(this);
    this.handleUpdateSubscriptionSelector = this.handleUpdateSubscriptionSelector.bind(this);
    this.handleNewSubscriptionSelector = this.handleNewSubscriptionSelector.bind(this);
    // ----------------------------------------------------
  }

  componentDidMount() {
    this.loadDatasets();
  }

  handleCancel() {
    this.setState({
      saved: false
    });
    this.props.toggleModal(false);
  }

  handleSubmit() {
    const { subscriptionSelectors } = this.state;
    const { mode, area, user } = this.props;
    let incomplete = false;
    subscriptionSelectors.forEach((val) => {
      if (!val.selectedType || !val.selectedDataset || !val.selectedThreshold) {
        incomplete = true;
      }
    });

    if (incomplete) {
      toastr.error('Data missing', 'Please select a dataset, subscription type and threshold for all items');
    } else {
      logEvent('My RW', 'Edit subscription', area.attributes.name);

      const datasets = subscriptionSelectors.map(val => val.selectedDataset);
      const datasetsQuery = subscriptionSelectors
        .map(val => ({
          id: val.selectedDataset,
          type: val.selectedType,
          threshold: val.selectedThreshold }
        ));

      if (mode === 'new') {
        if (datasets.length >= 1) {
          this.userService.createSubscriptionToArea(
            area.id,
            datasets,
            datasetsQuery,
            user,
            this.props.locale
          ).then(() => {
            toastr.success('Success!', 'Subscription created successfully');
            this.props.toggleModal(false);
            this.props.onSubscriptionCreated();
          })
            .catch(err => toastr.error('Error creating the subscription', err));
        } else {
          toastr.error('Error', 'Please select at least one dataset');
        }
      } else if (mode === 'edit') {
        if (datasets.length >= 1) {
          this.userService.updateSubscriptionToArea(
            area.subscription.id,
            datasets,
            datasetsQuery,
            user,
            this.props.locale
          ).then(() => {
            toastr.success('Success!', 'Subscription updated successfully');
            this.props.toggleModal(false);
            this.props.onSubscriptionUpdated();
          }).catch(err => toastr.error('Error updating the subscription', err));
        } else {
          this.userService.deleteSubscription(area.subscription.id, user.token)
            .then(() => {
              toastr.success('Success!', 'Subscription updated successfully');
              this.props.toggleModal(false);
              this.props.onSubscriptionUpdated();
            })
            .catch(err => toastr.error('Error updating the subscription', err));
        }
      }
    }
  }

  loadDatasets() {
    this.datasetService.getSubscribableDatasets('metadata').then((response) => {
      this.setState({
        loadingDatasets: false,
        datasets: response.filter(val => Object.keys(val.attributes.subscribable).length > 0)
      });
    }).catch(err => toastr.error('Error', err)); // TODO: update the UI
  }

  handleRemoveSubscriptionSelector(index) {
    const { subscriptionSelectors } = this.state;
    subscriptionSelectors.splice(index, 1);
    this.setState({ subscriptionSelectors });
  }

  handleUpdateSubscriptionSelector(element) {
    const { subscriptionSelectors } = this.state;
    subscriptionSelectors[element.index] = element;
    this.setState({ subscriptionSelectors });
  }

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
        <div className="header-text">
          Select the datasets that you want to subscribe to.
        </div>
        <Spinner isLoading={loading || loadingDatasets} className="-light" />
        <div className="datasets-container">
          {subscriptionSelectors.map((val, index) =>
            (<SubscriptionSelector
              datasets={datasets}
              data={val}
              onRemove={this.handleRemoveSubscriptionSelector}
              onUpdate={this.handleUpdateSubscriptionSelector}
              index={index}
              key={val.index}
            />)
          )}
        </div>
        <div className="new-container">
          <button className="c-btn -b -fullwidth" onClick={this.handleNewSubscriptionSelector}>
            Add dataset
          </button>
        </div>
        <div className="buttons">
          <button className="c-btn -primary" onClick={this.handleSubmit}>
            Done
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
  locale: PropTypes.string.isRequired,
  subscriptionDataset: PropTypes.string,
  subscriptionType: PropTypes.string,
  subscriptionThreshold: PropTypes.number,
  // Store
  user: PropTypes.object.isRequired,
  // Callbacks
  onSubscriptionCreated: PropTypes.func,
  onSubscriptionUpdated: PropTypes.func
};

const mapStateToProps = state => ({
  user: state.user,
  locale: state.common.locale
});

export default connect(mapStateToProps, null)(AreaSubscriptionModal);
