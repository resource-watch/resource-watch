import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import { Router } from 'routes';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';
import { toggleModal, setModalOptions } from 'redactions/modal';

// Components
import CustomSelect from 'components/ui/CustomSelect';
import Spinner from 'components/ui/Spinner';
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import UploadAreaIntersectionModal from 'components/modal/UploadAreaIntersectionModal';

// Services
import AreasService from 'services/AreasService';
import UserService from 'services/UserService';
import DatasetService from 'services/DatasetService';

const FORM_ELEMENTS = {
  elements: {
  },
  validate() {
    const elements = this.elements;
    Object.keys(elements).forEach((k) => {
      elements[k].validate();
    });
  },
  isValid() {
    const elements = this.elements;
    const valid = Object.keys(elements)
      .map(k => elements[k].isValid())
      .filter(v => v !== null)
      .every(element => element);

    return valid;
  }
};

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

class SubscriptionsForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      datasets: [],
      areaOptions: [],
      loadingAreaOptions: false,
      loadingDatasets: false,
      selectedArea: null,
      selectedType: null,
      selectedDataset: null,
      loading: false,
      name: '',
      geostore: null
    };

    // Services
    this.areasService = new AreasService({ apiURL: process.env.WRI_API_URL });
    this.userService = new UserService({ apiURL: process.env.WRI_API_URL });
    this.datasetService = new DatasetService(null, {
      apiURL: process.env.WRI_API_URL,
      language: props.locale
    });
  }

  componentDidMount() {
    this.loadAreas();
    this.loadDatasets();
  }

  @Autobind
  onSubmit(e) {
    e.preventDefault();

    const { selectedArea, name, selectedDataset, geostore, selectedType } = this.state;
    const { user } = this.props;

    if ((selectedArea || geostore) && selectedDataset && selectedType) {
      this.setState({
        loading: true
      });
      const areaObj = geostore ? { type: 'geostore', id: geostore } : { type: 'iso', id: selectedArea.value };
      this.userService.createSubscriptionToDataset(selectedDataset.id, selectedType.value, areaObj, user, name) //eslint-disable-line
        .then(() => {
          Router.pushRoute('myrw', { tab: 'areas' });
          toastr.success('Success', 'Subscription successfully created!');
        })
        .catch(err => this.setState({ error: err, loading: false }));
    }
  }

  @Autobind
  async onChangeSelectedArea(value) {
    return new Promise((resolve) => {
      if (value.value === 'upload') {
        this.props.toggleModal(true, {
          children: UploadAreaIntersectionModal,
          childrenProps: {
            onUploadArea: (id) => {
              this.setState({
                geostore: id
              });

              // We close the modal
              this.props.toggleModal(false, {});
              resolve(true);
            }
          },
          onCloseModal: () => resolve(false)
        });
      } else {
        this.setState({
          selectedArea: value
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

  @Autobind
  handleNameChange(value) {
    this.setState({
      name: value
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
        datasets: response.map(val => (
          {
            label: val.attributes.name,
            value: val.attributes.name,
            id: val.id,
            subscribable: val.attributes.subscribable
          }
        ))
      });
    }).catch(err => toastr.error('Error', err));
  }

  render() {
    const {
      areaOptions,
      loadingAreaOptions,
      selectedArea,
      loading,
      name,
      datasets,
      loadingDatasets,
      selectedDataset,
      selectedType
    } = this.state;

    const subscriptionTypes = selectedDataset ?
      Object.keys(selectedDataset.subscribable).map(val => ({ label: val, value: val })) : [];

    return (
      <div className="c-subscriptions-form">
        <Spinner loading={loading || loadingAreaOptions || loadingDatasets} className="-light" />
        <form className="c-form" onSubmit={this.onSubmit} noValidate>
          <fieldset className="c-field-container">
            <Field
              ref={(c) => { if (c) FORM_ELEMENTS.elements.name = c; }}
              onChange={this.handleNameChange}
              properties={{
                name: 'name',
                label: 'Name',
                type: 'text',
                value: name
              }}
            >
              {Input}
            </Field>
          </fieldset>
          <div className="selectors-container">
            <Spinner isLoading={loadingAreaOptions || loadingDatasets || loading} className="-light -small" />
            <CustomSelect
              placeholder="Select area"
              options={areaOptions}
              onValueChange={this.onChangeSelectedArea}
              allowNonLeafSelection={false}
              value={selectedArea && selectedArea.value}
              waitForChangeConfirmation
            />
            <CustomSelect
              placeholder="Select a dataset"
              options={datasets}
              onValueChange={this.onChangeSelectedDataset}
              allowNonLeafSelection={false}
              value={selectedDataset && selectedDataset.value}
            />
          </div>
          <div className="type-container">
            <CustomSelect
              placeholder="Select a subscription type"
              options={subscriptionTypes}
              onValueChange={this.onChangeSelectedType}
              allowNonLeafSelection={false}
              value={selectedType && selectedType.value}
            />
          </div>
          <div className="buttons-div">
            <button onClick={() => Router.pushRoute('myrw', { tab: 'areas' })} className="c-btn -secondary">
              Cancel
            </button>
            <button type="submit" className="c-btn -primary">
              Subscribe
            </button>
          </div>
        </form>
      </div>
    );
  }
}

SubscriptionsForm.propTypes = {
  // Store
  user: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  toggleModal: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  locale: state.common.locale
});

const mapDispatchToProps = dispatch => ({
  toggleModal: (open, opts) => { dispatch(toggleModal(open, opts)); },
  setModalOptions: (options) => { dispatch(setModalOptions(options)); }
});

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionsForm);
