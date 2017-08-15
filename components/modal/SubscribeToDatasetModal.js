import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';
import { Autobind } from 'es-decorators';

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
    label: 'Custom area',
    value: 'custom',
    items: [
      {
        label: 'Upload new area',
        value: 'upload',
        as: 'Custom area'
      }
    ]
  }
];


class SubscribeToDatasetModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      areaOptions: [],
      loadingAreaOptions: false,
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
    this.loadAreas();
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
      this.setState({
        areaOptions: [...AREAS, ...response.data],
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
    }).catch(err => console.error(err)); // TODO: update the UI
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
