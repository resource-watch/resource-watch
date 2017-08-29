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
import Spinner from 'components/ui/Spinner';
<<<<<<< Updated upstream
import Field from 'components/form/Field';
import Select from 'components/form/SelectInput';
=======
import SubscriptionSelector from 'components/subscriptions/SubscriptionSelector';
>>>>>>> Stashed changes

class AreaSubscriptionModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
<<<<<<< Updated upstream
=======
      loadingDatasets: false,
>>>>>>> Stashed changes
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
  handleCancel() {
    this.setState({
      saved: false
    });
    this.props.toggleModal(false);
  }


  @Autobind
  handleSubmit() {
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
<<<<<<< Updated upstream
      loading
    } = this.state;
    const subscriptionTypes = Object.keys(dataset.attributes.subscribable)
      .map(val => ({ value: val, label: val }));
=======
      loading,
      loadingDatasets
    } = this.state;
>>>>>>> Stashed changes

    return (
      <div className="c-area-subscription-modal" ref={(node) => { this.el = node; }}>
        <div className="header-div">
          <h2>Area subscriptions</h2>
        </div>
<<<<<<< Updated upstream
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
=======
        <Spinner isLoading={loading || loadingDatasets} className="-light" />
        <div className="datasets-container">
          {datasets.map((val, index) =>
            (<SubscriptionSelector
              datasets={datasets}
              id={index}
              onRemoveSubscription={this.handleRemoveSubscription}
            />)
>>>>>>> Stashed changes
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
  dataset: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired,
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(AreaSubscriptionModal);
