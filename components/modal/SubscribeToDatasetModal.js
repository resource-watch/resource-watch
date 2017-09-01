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
import UploadAreaIntersectionModal from 'components/modal/UploadAreaIntersectionModal';

const AREAS = [
  {
    label: 'Create new area',
    value: 'new_area'
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
      loading: false,
      saved: false,
      name: '',
      geostore: null,
      uploadArea: false // Whether the user wants to upload an area
    };

    // Services
    this.areasService = new AreasService({ apiURL: process.env.WRI_API_URL });
    this.userService = new UserService({ apiURL: process.env.WRI_API_URL });
  }

  componentDidMount() {
    // this.loadAreas();
    this.loadUserAreas();
  }

  componentDidUpdate(previousProps, previousState) {
    // When the user clicks on "Upload area", the selector awaits for
    // a confirmation before selecting the option
    // During this period, the selector stays open, so we trigger a click
    // somewhere else so it closes
    if (!previousState.uploadArea && this.state.uploadArea) {
      if (this.el) this.el.click();
    }
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
      } else if (value && value.value === 'new_area') {
        Router.pushRoute('myrw_detail', { tab: 'areas', id: 'new' });
      } else {
        this.setState({
          selectedArea: value,
          uploadArea: false
        });
        resolve(true);
      }
    });
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

  /**
   * Event handler executed when the user sucessfully upload an area
   * @param {string} id - Geostore ID
   */
  @Autobind
  onUploadArea(id) {
    // We tell the selector an area has been uploaded
    if (this.activePromiseResolve) {
      this.activePromiseResolve(true);
    }
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
              Do you want to update it on MyRW? `, {
                onOk: () => {
                  Router.pushRoute('myrw', { tab: 'areas' });
                }
              });
          } else {
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
        })
        .catch((err) => {
          this.setState({ loading: false });
          toastr.error('Error creating the subscription', err);
        });
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

  // loadAreas() {
  //   this.setState({
  //     loadingAreaOptions: true
  //   });
  //   this.areasService.fetchCountries().then((response) => {
  //     this.setState({
  //       areaOptions: [...this.state.areaOptions, ...AREAS, ...response.data],
  //       loadingAreaOptions: false
  //     });
  //   });
  // }

  /**
   * Fetchs the user areas
   */
  loadUserAreas() {
    this.setState({ loadingUserAreas: true });
    this.userService.getUserAreas(this.props.user.token)
      .then((response) => {
        const userAreas = response.map(val => ({
          label: val.attributes.name,
          value: val.attributes.geostore ? val.attributes.geostore : val.attributes.iso.country,
          isGeostore: val.attributes.geostore,
          areaID: val.id
        }));
        this.setState({
          loadingUserAreas: false,
          areaOptions: [...AREAS, ...userAreas]
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
      loading,
      saved,
      name,
      uploadArea
    } = this.state;
    const { dataset } = this.props;
    let headerText;
    if (saved) {
      headerText = 'Subscription saved!';
    } else if (dataset) {
      headerText = `Subscribe to ${dataset.attributes.name}`;
    }
    const paragraphText = saved ?
      'Your subscription was successfully created. Please check your email address to confirm it' :
      'Please enter a name and select an area for the subscription';
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
            <div className="name-container">
              <div className="c-field">
                <label htmlFor="subscription-name">Subscription name</label>
                <input id="subscription-name" value={name} onChange={this.handleNameChange} />
              </div>
            </div>
            <div className="selectors-container">
              <Spinner isLoading={loadingAreaOptions || loading} className="-light -small" />
              <div className="c-field">
                <CustomSelect
                  placeholder="Select area"
                  options={areaOptions}
                  onValueChange={this.onChangeSelectedArea}
                  allowNonLeafSelection={false}
                  value={selectedArea && selectedArea.value}
                  waitForChangeConfirmation
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
            </div>
            { uploadArea && (
              <div className="upload-form">
                <UploadAreaIntersectionModal onUploadArea={this.onUploadArea} embed />
              </div>
            ) }
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
              Check my subscriptions
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
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(SubscribeToDatasetModal);
