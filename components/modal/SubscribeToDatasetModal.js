import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';
import { Autobind } from 'es-decorators';

// Redux
import { connect } from 'react-redux';

// Services
import AreasService from 'services/AreasService';
import UserService from 'services/UserService';
import DatasetService from 'services/DatasetService';

// components
import CustomSelect from 'components/ui/CustomSelect';
import Spinner from 'components/ui/Spinner';


class SubscribeToDatasetModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      datasets: [],
      areaOptions: [],
      loadingAreaOptions: false,
      loadingDatasets: false,
      selectedArea: null,
      loading: false,
      saved: false,
      name: ''
    };

    // Services
    this.areasService = new AreasService({ apiURL: process.env.WRI_API_URL });
    this.userService = new UserService({ apiURL: process.env.WRI_API_URL });
    this.datasetService = new DatasetService(null, { apiURL: process.env.WRI_API_URL });
  }

  componentDidMount() {
    this.loadAreas();
    if (this.props.showDatasetSelector) {
      this.loadDatasets();
    }
  }

  @Autobind
  onChangeSelectedArea(value) {
    this.setState({
      selectedArea: value
    });
  }

  @Autobind
  onChangeSelectedDataset(value) {
    this.setState({
      selectedDataset: value
    });
  }

  loadAreas() {
    this.setState({
      loadingAreaOptions: true
    });
    this.areasService.fetchCountries().then((response) => {
      this.setState({
        areaOptions: response.data,
        loadingAreaOptions: false
      });
    });
  }

  loadDatasets() {
    this.datasetService.getSubscribableDatasets().then((response) => {
      this.setState({
        loadingDatasets: false,
        datasets: response.filter(val => val.attributes.subscribable).map(val => (
          { label: val.attributes.name, value: val.attributes.name, id: val.id }))
      });
    }).catch(err => console.log(err));
  }

  @Autobind
  handleSubscribe() {
    const { selectedArea, name, selectedDataset } = this.state;
    const { dataset, user, showDatasetSelector } = this.props;
    const datasetId = dataset ? dataset.id : (selectedDataset && selectedDataset.id);

    if (selectedArea) {
      if (!showDatasetSelector || (showDatasetSelector && selectedDataset)) {
        this.setState({
          loading: true
        });
        this.userService.createSubscriptionToDataset(datasetId, selectedArea.value, user, name)
          .then(() => {
            this.setState({
              loading: false,
              saved: true
            });
          })
          .catch(err => this.setState({ error: err, loading: false }));
      }
    }
  }

  @Autobind
  handleGoToMySubscriptions() {
    this.setState({
      saved: false
    });
    this.props.toggleModal(false);
    Router.pushRoute('myrw', { tab: 'subscriptions' });
  }

  @Autobind
  handleNameChange(event) {
    this.setState({
      name: event.target.value
    });
  }

  @Autobind
  handleCancel() {
    this.setState({
      saved: false
    });
    this.props.toggleModal(false);
  }

  render() {
    const {
      areaOptions,
      loadingAreaOptions,
      selectedArea,
      loading,
      saved,
      name,
      datasets,
      loadingDatasets,
      selectedDataset
    } = this.state;
    const { dataset, showDatasetSelector } = this.props;
    let headerText;
    if (saved) {
      headerText = 'Subscription saved!';
    } else if (dataset) {
      headerText = `Subscribe to ${dataset.attributes.name}`;
    } else {
      headerText = 'Subscribe to alerts';
    }
    const paragraphText = saved ?
      'Your subscription was successfully created. Please check your email address to confirm it' :
      'Please enter a name and select an area for the subscription';

    return (
      <div className="c-subscribe-to-dataset-modal">
        <div className="header-div">
          <h2 className="c-text -header-normal -thin title">{headerText}</h2>
          <p>{paragraphText}</p>
        </div>
        {!saved &&
          <div>
            <div className="name-container">
              <h5>Subscription name</h5>
              <input value={name} onChange={this.handleNameChange} />
            </div>
            <div className="selectors-container">
              <Spinner isLoading={loadingAreaOptions || loadingDatasets || loading} className="-light -small" />
              <CustomSelect
                placeholder="Select area"
                options={areaOptions}
                onValueChange={this.onChangeSelectedArea}
                allowNonLeafSelection={false}
                value={selectedArea && selectedArea.value}
              />
              {showDatasetSelector &&
                <CustomSelect
                  placeholder="Select a dataset"
                  options={datasets}
                  onValueChange={this.onChangeSelectedDataset}
                  allowNonLeafSelection={false}
                  value={selectedDataset && selectedDataset.value}
                />
              }
            </div>
          </div>
        }

        {saved &&
          <div className="icon-container">
            <img alt="" src="/static/images/components/modal/widget-saved.svg" />
          </div>
        }

        {!saved &&
          <div className="buttons-div">
            <button className="c-btn -primary" onClick={this.handleSubscribe}>
              Subscribe
            </button>
            <button className="c-btn -secondary" onClick={this.handleCancel}>
              Cancel
            </button>
          </div>
        }

        {saved &&
          <div className="buttons-div">
            <button className="c-btn -secondary" onClick={this.handleCancel}>
              Ok
            </button>
            <button className="c-btn -primary" onClick={this.handleGoToMySubscriptions}>
              Check my subscriptions
            </button>
          </div>
        }
      </div>
    );
  }
}

SubscribeToDatasetModal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  dataset: PropTypes.object,
  showDatasetSelector: PropTypes.bool.isRequired,
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(SubscribeToDatasetModal);
