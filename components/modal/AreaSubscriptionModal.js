import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

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

    this.state = {
      loadingDatasets: false,
      loading: false,
      datasets: [],
      subscriptionSelectors: [{ index: 0, selectedDataset: null, selectedType: null }]
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

    return (
      <div className="c-area-subscription-modal" ref={(node) => { this.el = node; }}>
        <div className="header-div">
          <h2>Area subscriptions</h2>
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
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(AreaSubscriptionModal);
