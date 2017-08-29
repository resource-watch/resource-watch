import React from 'react';
import PropTypes from 'prop-types';
<<<<<<< Updated upstream
import { Router } from 'routes';
import { Autobind } from 'es-decorators';

// Redux
import { connect } from 'react-redux';

// Services
import AreasService from 'services/AreasService';
import UserService from 'services/UserService';

// Components
import Spinner from 'components/ui/Spinner';
import Field from 'components/form/Field';
import Select from 'components/form/SelectInput';

class AreaSubscriptionModal extends React.Component {
=======
import { Autobind } from 'es-decorators';

// Components
import Field from 'components/form/Field';
import Select from 'components/form/SelectInput';

class SubscriptionSelector extends React.Component {
>>>>>>> Stashed changes
  constructor(props) {
    super(props);

    this.state = {
<<<<<<< Updated upstream
      loading: false,
      datasets: [{}]
    };

    // Services
    this.areasService = new AreasService({ apiURL: process.env.WRI_API_URL });
    this.userService = new UserService({ apiURL: process.env.WRI_API_URL });
  }

  componentDidMount() {
    this.loadDatasets();
  }

  @Autobind
  async onChangeSelectedArea(value) {
    return new Promise((resolve) => {
      // We delete the pointer to the old resolve method
      if (this.activePromiseResolve) this.activePromiseResolve = null;

      if (value && value.value === 'upload') {
        // We store the resolve method so we can call it from another
        // method and at any time
        this.activePromiseResolve = resolve;

        this.setState({ uploadArea: true });
      } else {
        this.setState({
          selectedArea: value,
          uploadArea: false
        });
        resolve(true);
      }
    });
  }
=======
      selectedDataset: null,
      selectedType: null
    };
  }

>>>>>>> Stashed changes

  @Autobind
  onChangeSelectedDataset(value) {
    this.setState({
      selectedDataset: value
    });
  }

  @Autobind
  onChangeSelectedType(type) {
    this.setState({ selectedType: type });
  }

<<<<<<< Updated upstream
  /**
   * Event handler executed when the user sucessfully upload an area
   * @param {string} id - Geostore ID
   */
  @Autobind
  onUploadArea(id) {
    // We tell the selector an area has been uploaded
    if (this.activePromiseResolve) this.activePromiseResolve(true);

    this.setState({ selectedArea: id });
  }

  @Autobind
  handleCancel() {
    this.setState({
      saved: false
    });
    this.props.toggleModal(false);
  }


  @Autobind
  handleSubscribe() {
    const { selectedArea, name, geostore, selectedType } = this.state;
    const { dataset, user } = this.props;

    if ((selectedArea || geostore) && selectedType) {
      this.setState({
        loading: true
      });
      const areaObj = geostore ? { type: 'geostore', id: geostore } : { type: 'iso', id: selectedArea.value };
      this.userService.createSubscriptionToDataset(dataset.id, selectedType.value, areaObj, user, name) //eslint-disable-line
        .then(() => {
          this.setState({
            loading: false,
            saved: true
          });
        })
        .catch(err => this.setState({ error: err, loading: false }));
    }
  }

  loadDatasets() {
    this.datasetService.getSubscribableDatasets().then((response) => {
      this.setState({
        loadingDatasets: false,
        datasets: response.filter(val => val.attributes.subscribable).map(val => (
          { label: val.attributes.name, value: val.attributes.name, id: val.id }))
      });
    }).catch(err => console.error(err)); // TODO: update the UI
  }

  render() {
    const {
      datasets,
      loading
    } = this.state;
    const subscriptionTypes = Object.keys(dataset.attributes.subscribable)
      .map(val => ({ value: val, label: val }));

    return (
      <div className="c-area-subscription-modal" ref={(node) => { this.el = node; }}>
        <div className="header-div">
          <h2>Area subscriptions</h2>
        </div>
        <div className="datasets-container">
          {datasets.map(val =>
            (<div className="selectors">
              <Field
                onChange={this.handleDatasetSelected}
                className="-fluid"
                options={datasets}
                properties={{
                  name: 'dataset',
                  label: 'Dataset',
                  value: selectedDataset,
                  required: true,
                  instanceId: 'selectDataset'
                }}
              >
                {Select}
              </Field>
            </div>)
          )}
        </div>
        <div className="buttons">
          <button className="c-btn -primary" onClick={this.handleSubmit}>
            Submit
          </button>
          <button className="c-btn -secondary" onClick={this.handleCancel}>
            Cancel
          </button>
=======
  @Autobind
  handleRemove() {
    this.props.onRemoveSubscription();
  }

  render() {
    const { datasets } = this.props;
    const { selectedDataset, selectedType } = this.state;

    const typeOptions = Object.keys(selectedDataset.attributes.subscribable)
      .map(val => ({ value: val, label: val }));

    return (
      <div className="c-subscription-selector" ref={(node) => { this.el = node; }}>

        <div className="datasets-container">
          <Field
            onChange={this.handleDatasetSelected}
            className="-fluid"
            options={datasets}
            properties={{
              name: 'dataset',
              label: 'Dataset',
              value: selectedDataset,
              required: true,
              instanceId: 'selectDataset'
            }}
          >
            {Select}
          </Field>
          <Field
            onChange={this.handleTypeSelected}
            className="-fluid"
            options={typeOptions}
            properties={{
              name: 'type',
              label: 'Type',
              value: selectedType,
              required: true,
              instanceId: 'selectType'
            }}
          >
            {Select}
          </Field>
>>>>>>> Stashed changes
        </div>
      </div>
    );
  }
}

<<<<<<< Updated upstream
AreaSubscriptionModal.propTypes = {
  dataset: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired,
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

=======
SubscriptionSelector.propTypes = {
  datasets: PropTypes.array.isRequired,
  // CALLBACKS
  onRemoveSubscription: PropTypes.func.isRequired
};

>>>>>>> Stashed changes
export default SubscriptionSelector;
