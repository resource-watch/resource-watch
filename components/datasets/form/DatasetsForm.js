import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';

// services
import {
  fetchDataset,
  createDataset,
  updateDataset
} from 'services/dataset';
import { fetchFields } from 'services/fields';

// components
import Navigation from 'components/form/Navigation';
import Step1 from 'components/datasets/form/steps';
import Spinner from 'components/ui/Spinner';

// utils
import { logEvent } from 'utils/analytics';
import { sortLayers } from 'utils/layers';
import { getFieldUrl, getFields } from 'utils/fields';

// constants
import { STATE_DEFAULT, FORM_ELEMENTS } from './constants';

class DatasetsForm extends PureComponent {
  static propTypes = {
    application: PropTypes.array.isRequired,
    // TO-DO: remove
    authorization: PropTypes.string.isRequired,
    dataset: PropTypes.string,
    basic: PropTypes.bool,
    onSubmit: PropTypes.func
  }

  static defaultProps = {
    dataset: null,
    basic: true,
    onSubmit: null
  }

  state = Object.assign({}, STATE_DEFAULT, {
    loading: !!this.props.dataset,
    loadingColumns: !!this.props.dataset,
    columns: [],
    form: Object.assign({}, STATE_DEFAULT.form, { application: this.props.application })
  });

  UNSAFE_componentWillMount() {
    const { dataset: datasetId } = this.props;
    // Get the dataset and fill the state with its params if it exists
    if (datasetId) {
      fetchDataset(datasetId, { includes: 'layer' })
        .then((dataset) => {
          const { provider, applicationConfig, layer: layers } = dataset;
          let _layers = layers;

          // sorts layers if applies
          if (
            applicationConfig &&
            applicationConfig[process.env.APPLICATIONS] &&
            applicationConfig[process.env.APPLICATIONS].layerOrder &&
            layers.length > 1) {
            const { layerOrder } = applicationConfig[process.env.APPLICATIONS];
            _layers = sortLayers(layers, layerOrder);
          }

          this.setState({
            form: this.setFormFromParams(dataset),
            loading: false,
            loadingColumns: true,
            layers: _layers,
            dataDataset: dataset
          });

          if (provider !== 'wms') {
            // fetchs column fields based on dataset type
            const url = getFieldUrl(dataset);
            fetchFields(url)
              .then((rawFields) => {
                const { type } = dataset;
                const columns = getFields(rawFields, provider, type);
                this.setState({
                  columns,
                  loadingColumns: false
                });
              })
              .catch(({ message }) => {
                const { id } = dataset;
                this.setState({ loadingColumns: false }, () => { toastr.error(`Error fetching fields from dataset ${id}`); });
                console.error(`Error fetching fields from dataset ${id}`, message);
              });
          } else {
            this.setState({ loadingColumns: false });
          }
        })
        .catch(({ message }) => {
          this.setState({ loading: false }, () => { toastr.error('Error fetching dataset'); });
          console.error(`Error fetching dataset: ${message}`);
        });
    }
  }

  onSubmit = (event) => {
    const { authorization, dataset } = this.props;
    event.preventDefault();

    // Validate the form
    FORM_ELEMENTS.validate(this.state.step);

    // Set a timeout due to the setState function of react
    setTimeout(() => {
      // Validate all the inputs on the current step
      const valid = FORM_ELEMENTS.isValid(this.state.step);

      if (valid) {
        // if we are in the last step we will submit the form
        if (this.state.step === this.state.stepLength && !this.state.submitting) {
          const { form, layers } = this.state;
          logEvent('My RW', 'Add New Dataset', form.name);

          // Start the submitting
          this.setState({ submitting: true });

          // Set the request
          const requestOptions = {
            type: dataset ? 'PATCH' : 'POST',
            omit: dataset
              ? ['connectorUrlHint', 'connectorType', 'provider']
              : ['connectorUrlHint']
          };

          let bodyObj = omit(form, requestOptions.omit);

          bodyObj.subscribable = {};
          form.subscribable.forEach((_subscription) => {
            bodyObj.subscribable[_subscription.type] = Object.assign(
              {},
              {
                dataQuery: _subscription.dataQuery,
                subscriptionQuery: _subscription.subscriptionQuery
              }
            );
          });

          // every updated dataset will contain set the layer order in its config
          // if it doesn't previously
          if (
            dataset &&
            layers.length &&
            (!bodyObj.applicationConfig ||
            !bodyObj.applicationConfig[process.env.APPLICATIONS] ||
            !bodyObj.applicationConfig[process.env.APPLICATIONS].layerOrder)
          ) {
            bodyObj = {
              ...bodyObj,
              applicationConfig: {
                ...form.applicationConfig,
                [process.env.APPLICATIONS]: {
                  ...(form.applicationConfig && form.applicationConfig[process.env.APPLICATIONS]),
                  layerOrder: layers.map(_layer => _layer.id)
                }
              }
            };
          }

          if (requestOptions.type === 'PATCH') {
            updateDataset(dataset, authorization, bodyObj)
              .then((data) => {
                this.setState({ submitting: false });
                toastr.success(
                  'Success',
                  `The dataset "${data.id}" - "${data.name}" has been updated correctly`
                );
                if (this.props.onSubmit) this.props.onSubmit(data.id);
              })
              .catch((err) => {
                this.setState({ submitting: false });
                toastr.error('There was an error updating the dataset', err);
              });
          } else if (requestOptions.type === 'POST') {
            createDataset(authorization, bodyObj)
              .then((data) => {
                this.setState({ submitting: false });
                toastr.success(
                  'Success',
                  `The dataset "${data.id}" - "${data.name}" has been created correctly`
                );
                if (this.props.onSubmit) this.props.onSubmit(data.id);
              })
              .catch((err) => {
                this.setState({ submitting: false });
                toastr.error('There was an error creating the dataset', err);
              });
          }
        } else {
          this.setState({ step: this.state.step + 1 });
        }
      } else {
        toastr.error('Error', 'Fill all the required fields or correct the invalid values');
      }
    }, 0);
  }

  onChange = (obj) => {
    const form = Object.assign({}, this.state.form, obj);
    this.setState({ form });
  }

  onStepChange = (step) => {
    this.setState({ step });
  }

  // HELPERS
  setFormFromParams(params) {    
    const form = Object.keys(this.state.form);
    const newForm = {};

    form.forEach((f) => {
      if (params[f] || this.state.form[f]) {
        if (f === 'subscribable') {
          const subscribable = params[f] || this.state.form[f];
          newForm.subscribable = Object.keys(subscribable).map((prop, i) => ({
            type: prop,
            dataQuery: subscribable[prop].dataQuery,
            subscriptionQuery: subscribable[prop].subscriptionQuery,
            id: i
          }));
        } else {
          newForm[f] = params[f] || this.state.form[f];
        }
      }
    });    
    return newForm;
  }

  render() {
    const {
      layers,
      loading,
      step,
      form,
      loadingColumns,
      columns,
      stepLength,
      submitting,
      dataDataset
    } = this.state;
    const { dataset, basic, authorization } = this.props;

    return (
      <form className="c-form c-datasets-form" onSubmit={this.onSubmit} noValidate>
        <Spinner isLoading={loading} className="-light" />

        {step === 1 && !loading && (
          <Step1
            onChange={value => this.onChange(value)}
            basic={basic}
            form={form}
            dataset={dataset}
            dataDataset={dataDataset}
            columns={columns}
            loadingColumns={loadingColumns}
            sortedLayers={layers}
            authorization={authorization}
          />
        )}

        {!loading && (
          <Navigation
            step={step}
            stepLength={stepLength}
            submitting={submitting}
            onStepChange={this.onStepChange}
          />
        )}
      </form>
    );
  }
}


const mapStateToProps = state => ({ locale: state.common.locale });

export default connect(
  mapStateToProps,
  null
)(DatasetsForm);
