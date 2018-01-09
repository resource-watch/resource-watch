import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';
import { Autobind } from 'es-decorators';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';

// Services
import AreasService from 'services/AreasService';
import UserService from 'services/UserService';

// Components
import CustomSelect from 'components/ui/CustomSelect';
import Spinner from 'components/ui/Spinner';
import Field from 'components/form/Field';
import Input from 'components/form/Input';

const AREAS = [
  {
    label: 'Upload custom area',
    value: 'upload_area'
  }
];


class SubscribeToDatasetModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      areaOptions: [],
      loadingAreaOptions: false,
      loadingUserAreas: false,
      selectedArea: null,
      selectedType: null,
      selectedThreshold: 1,
      loading: false,
      saved: false,
      geostore: null,
      userAreas: []
    };

    // Services
    this.areasService = new AreasService({ apiURL: process.env.WRI_API_URL });
    this.userService = new UserService({ apiURL: process.env.WRI_API_URL });
  }

  componentDidMount() {
    this.loadAreas();
    this.loadUserAreas();
  }

  @Autobind
  onChangeSelectedArea(value) {
    if (value && value.value === 'upload_area') {
      this.setState({ loading: true });
      this.props.toggleModal(false);
      Router.pushRoute('myrw_detail', {
        tab: 'areas',
        id: 'new',
        subscriptionDataset: this.props.dataset.id,
        subscriptionType: this.state.selectedType,
        subscriptionThreshold: this.state.selectedThreshold,
        openUploadAreaModal: true
      });
    } else {
      this.setState({
        selectedArea: value,
        uploadArea: false
      });
    }
  }

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

  @Autobind
  handleThresholdChange(threshold) {
    let newThreshold = threshold;
    if (threshold <= 0) {
      newThreshold = 1;
    }
    this.setState({ selectedThreshold: newThreshold });
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
    const { selectedArea, selectedType, selectedThreshold, userAreas } = this.state;
    const { dataset, user } = this.props;

    if (selectedArea && selectedType) {
      this.setState({
        loading: true
      });

      // ++++++++++ THE USER SELECTED AN AREA HE/SHE PREVIOUSLY CREATED +++++++++++++++
      if (selectedArea.areaID) {
        // Check first if there already exists a subscription for the same area
        this.userService.getSubscriptions(user.token)
          .then((data) => {
            let areaFound = false;
            data.forEach((subscription) => {
              const params = subscription.attributes.params;
              if (params.area && selectedArea.areaID && params.area === selectedArea.areaID) {
                areaFound = true;
              }
            });
            if (areaFound) {
              toastr.confirm(`There already exist a subscription for the selected area.
                Do you want to update it? `, {
                  onOk: () => {
                    Router.pushRoute('myrw', {
                      tab: 'areas',
                      subscriptionType: selectedType.value,
                      subscriptionThreshold: selectedThreshold,
                      subscriptionDataset: dataset.id,
                      openModal: selectedArea.areaID
                    });
                  },
                  onCancel: () => {
                    this.setState({ loading: false });
                  }
                });
            } else {
              const datasets = [dataset.id];
              const datasetsQuery = {
                id: dataset.id,
                type: selectedType.value,
                threshold: selectedThreshold
              };
              this.userService.createSubscriptionToArea(
                selectedArea.areaID,
                datasets,
                datasetsQuery,
                user,
                this.props.locale
              ).then(() => {
                this.setState({
                  loading: false,
                  saved: true
                });
              }).catch((err) => {
                toastr.error('Error', err);
                this.setState({ error: err, loading: false });
              });
            }
          })
          .catch((err) => {
            this.setState({ loading: false });
            toastr.error('Error creating the subscription', err);
          });
      } else {
        // ++++++++++ THE USER SELECTED A COUNTRY +++++++++++++++

        let areaID = null;
        const datasets = [dataset.id];
        const datasetsQuery = {
          id: dataset.id,
          type: selectedType.value,
          threshold: selectedThreshold
        };
        // Check if the user already has an area with that country
        if (userAreas.map(val => val.value).includes(selectedArea.value)) {
          areaID = userAreas.find(val => val.value === selectedArea.value).areaID;
          // Create the subscription
          this.userService.createSubscriptionToArea(
            areaID,
            datasets,
            datasetsQuery,
            user
          ).then(() => {
            this.setState({
              loading: false,
              saved: true
            });
          }).catch((err) => {
            toastr.error('Error', err);
            this.setState({ error: err, loading: false });
          });
        } else {
          // In the case there's no user area for the selected country we create one on the fly
          this.userService.createNewArea(selectedArea.label, selectedArea.isGeostore, user.token)
            .then((response) => {
              areaID = response.data.id;
              this.userService.createSubscriptionToArea(
                areaID,
                datasets,
                datasetsQuery,
                user
              ).then(() => {
                this.setState({
                  loading: false,
                  saved: true
                });
              }).catch((err) => {
                toastr.error('Error', err);
                this.setState({ error: err, loading: false });
              });
            })
            .catch(err => toastr.error('Error creating area', err));
        }
      }
    } else {
      toastr.error('Data missing', 'Please select an area and a subscription type');
    }
  }

  @Autobind
  handleGoToMySubscriptions() {
    this.setState({
      saved: false
    });
    this.props.toggleModal(false);
    Router.pushRoute('myrw', { tab: 'areas' });
  }

  @Autobind
  handleNameChange(event) {
    this.setState({
      name: event.target.value
    });
  }

  loadAreas() {
    this.setState({
      loadingAreaOptions: true
    });
    this.areasService.fetchCountries().then((response) => {
      const countries = response.map(val => ({
        label: val.name || '',
        value: val.geostoreId,
        isGeostore: val.geostoreId,
        areaID: null
      }));
      this.setState({
        areaOptions: [...this.state.areaOptions, ...countries],
        loadingAreaOptions: false
      });
    });
  }

  /**
   * Fetchs the user areas
   */
  loadUserAreas() {
    this.setState({ loadingUserAreas: true });
    this.userService.getUserAreas(this.props.user.token)
      .then((response) => {
        const userAreas = response.map(val => ({
          label: val.attributes.name,
          value: val.id,
          isGeostore: val.attributes.geostore,
          areaID: val.id
        }));
        this.setState({
          loadingUserAreas: false,
          areaOptions: [...AREAS, ...userAreas, ...this.state.areaOptions],
          userAreas
        });
      })
      .catch((err) => {
        this.setState({ loadingUserAreas: false });
        toastr.error('Error loading user areas', err);
      });
  }

  loadDatasets() {
    this.datasetService.getSubscribableDatasets().then((response) => {
      this.setState({
        loadingDatasets: false,
        datasets: response.filter(val => val.attributes.subscribable).map(val => (
          { label: val.attributes.name, value: val.attributes.name, id: val.id }))
      });
    }).catch(err => toastr.error(err)); // TODO: update the UI
  }

  render() {
    const {
      areaOptions,
      loadingAreaOptions,
      selectedArea,
      selectedType,
      selectedThreshold,
      loading,
      saved
    } = this.state;
    const { dataset } = this.props;
    let headerText;
    if (saved) {
      headerText = 'Subscription saved!';
    } else if (dataset) {
      headerText = `Subscribe to ${dataset.attributes.name}`;
    }
    const paragraphText = saved ?
      'Your subscription was successfully created. Please check your email address to confirm it.' :
      'Please select an area and a subscription type.';
    const subscriptionTypes = Object.keys(dataset.attributes.subscribable)
      .map(val => ({ value: val, label: val }));

    return (
      <div className="c-subscribe-to-dataset-modal" ref={(node) => { this.el = node; }}>
        <div className="header-div">
          <h2>{headerText}</h2>
          <p>{paragraphText}</p>
        </div>
        {!saved &&
          <div>
            <div className="selectors-container">
              <Spinner isLoading={loadingAreaOptions || loading} className="-light -small" />
              <div className="c-field">
                <CustomSelect
                  placeholder="Select area"
                  options={areaOptions}
                  onValueChange={this.onChangeSelectedArea}
                  allowNonLeafSelection={false}
                  value={selectedArea && selectedArea.value}
                />
              </div>
              <div className="c-field">
                <CustomSelect
                  placeholder="Select a subscription type"
                  options={subscriptionTypes}
                  onValueChange={this.onChangeSelectedType}
                  allowNonLeafSelection={false}
                  value={selectedType && selectedType.value}
                />
              </div>
              <div className="threshold-div">
                <span className="threshold-label">
                  Threshold  &ge;
                </span>
                <Field
                  className="threshold-input"
                  onChange={this.handleThresholdChange}
                  properties={{
                    name: 'threshold',
                    type: 'number',
                    default: selectedThreshold,
                    value: selectedThreshold
                  }}
                >
                  {Input}
                </Field>
              </div>
            </div>
          </div>
        }

        {saved &&
          <div className="icon-container">
            <img alt="" src="/static/images/components/modal/widget-saved.svg" />
          </div>
        }

        {!saved &&
          <div className="buttons">
            <button className="c-btn -primary" onClick={this.handleSubscribe}>
              Subscribe
            </button>
            <button className="c-btn -secondary" onClick={this.handleCancel}>
              Cancel
            </button>
          </div>
        }

        {saved &&
          <div className="buttons">
            <button className="c-btn -secondary" onClick={this.handleCancel}>
              Ok
            </button>
            <button className="c-btn -primary" onClick={this.handleGoToMySubscriptions}>
              View my subscriptions
            </button>
          </div>
        }
      </div>
    );
  }
}

SubscribeToDatasetModal.propTypes = {
  dataset: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired,
  // Store
  user: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  locale: state.common.locale
});

export default connect(mapStateToProps, null)(SubscribeToDatasetModal);
