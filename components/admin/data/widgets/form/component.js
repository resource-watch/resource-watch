import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'react-fast-compare';
import { toastr } from 'react-redux-toastr';
import { Router } from 'routes';

// components
import Navigation from 'components/form/Navigation';
import Step1 from 'components/admin/data/widgets/form/steps/Step1';
import Spinner from 'components/ui/Spinner';

// services
import { fetchDatasets } from 'services/dataset';
import {
  fetchWidget,
  deleteWidget,
  updateWidget as updateWidgetService,
  createWidget as createWidgetService
} from 'services/widget';
import { fetchQuery } from 'services/query';

// utils
import { getDataURL, getChartInfo } from 'utils/widgets/WidgetHelper';

// constants
import { STATE_DEFAULT, FORM_ELEMENTS } from './constants';

class WidgetForm extends PureComponent {
  static propTypes = {
    authorization: PropTypes.string.isRequired,
    id: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    newState: PropTypes.bool.isRequired,
    dataset: PropTypes.string
  };

  static defaultProps = {
    id: null,
    dataset: null
  };

  state = Object.assign({}, STATE_DEFAULT, {
    id: this.props.id,
    loading: !!this.props.id,
    form: {
      ...STATE_DEFAULT.form,
      dataset: this.props.dataset
    }
  });

  UNSAFE_componentWillMount() {
    const { locale } = this.props;
    const { id } = this.state;

    const promises = [
      // TO-DO: replace this for a dynamic search or lazy loading
      fetchDatasets({
        application: [process.env.APPLICATIONS].join(','),
        language: locale,
        'page[size]': 9999999,
        sort: 'name',
        env: process.env.API_ENV
      })
    ];

    // fetchs the widget if exists
    if (id) promises.push(fetchWidget(id));

    Promise.all(promises)
      .then((response) => {
        const datasets = response[0];
        const current = response[1];

        this.setState({
          // current widget
          form: id ? this.setFormFromParams(current) : this.state.form,
          loading: false,
          datasets: datasets.map(_dataset => ({
            label: _dataset.name,
            value: _dataset.id,
            type: _dataset.type,
            tableName: _dataset.tableName,
            slug: _dataset.slug
          }))
        });
      })
      .catch((err) => {
        this.setState({ loading: false }, () => {
          toastr.error('Something went wrong', err.message);
        });
      });
  }

  /**
   * UI EVENTS
   * - onSubmit
   * - onChange
   */
  onSubmit = (event) => {
    const { submitting, stepLength, step, form, id } = this.state;
    const { authorization } = this.props;
    event.preventDefault();

    // Validate the form
    FORM_ELEMENTS.validate(step);

    // Set a timeout due to the setState function of react
    setTimeout(async () => {
      // Validate all the inputs on the current step
      const validWidgetConfig = mode === 'editor' ? this.validateWidgetConfig() : true;
      const valid = FORM_ELEMENTS.isValid(step) && validWidgetConfig;
      if (valid) {
        // if we are in the last step we will submit the form
        if (step === stepLength && !submitting) {
          // Start the submission
          this.setState({ submitting: true });
          const formObj = mode === 'editor' ? { ...form, widgetConfig } : form;

          if (formObj.sourceUrl === '') {
            delete formObj.sourceUrl;
          }

          // The widget has to be "frozen" first
          if (formObj.freeze && widgetConfig.paramsConfig.visualizationType === 'chart') {
            const datasetObj = this.state.datasets.find(d => d.value === form.dataset);
            const tempBand = formObj.widgetConfig.paramsConfig
              ? formObj.widgetConfig.paramsConfig.band
              : null;
            getDataURL(
              datasetObj.value,
              datasetObj.type,
              datasetObj.tableName,
              tempBand,
              datasetObj.provider,
              getChartInfo(datasetObj.value, datasetObj.type, datasetObj.provider, widgetEditor),
              false,
              datasetObj.slug
            ).then((dataURL) => {
              const sqlSt = dataURL.split('sql=')[1];

              fetchQuery(authorization, sqlSt, { freeze: true }).then((resp) => {
                const { url } = resp;
                formObj.queryUrl = url;
                formObj.widgetConfig.data = [
                  {
                    format: {
                      property: 'data',
                      type: 'json'
                    },
                    name: 'table',
                    url
                  }
                ];

                if (id) {
                  this.updateWidget(formObj);
                } else {
                  this.createWidget(formObj);
                }
              });
            });
          } else if (id) {
            this.updateWidget(formObj);
          } else {
            this.createWidget(formObj);
          }
        } else {
          this.setState({ step: this.state.step + 1 });
        }
      } else {
        if (!validWidgetConfig && mode === 'editor') {
          return this.errorValidationWidgetConfig();
        }

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
    const newForm = {};

    Object.keys(params).forEach((f) => {
      switch (f) {
        default: {
          if (
            typeof params[f] !== 'undefined' ||
            params[f] !== null ||
            (typeof this.state.form[f] !== 'undefined' || this.state.form[f] !== null)
          ) {
            newForm[f] = params[f] || this.state.form[f];
          }
        }
      }
    });

    return newForm;
  }

  createWidget(widget) {
    const { onSubmit, dataset, authorization } = this.props;
    createWidgetService(widget, dataset, authorization)
      .then((response) => {
        const { id, name } = response;
        toastr.success('Success', `The widget "${id}" - "${name}" has been created correctly`);
        this.setState({ submitting: false });
        if (onSubmit) onSubmit(widget);
      })
      .catch((error) => {
        this.setState({ submitting: false });
        toastr.error('Tnere was an error', error);
      });
  }

  updateWidget(widget) {
    const { onSubmit, authorization } = this.props;
    updateWidgetService(widget, authorization)
      .then((response) => {
        const { id, name } = response;
        toastr.success('Success', `The widget "${id}" - "${name}" has been updated correctly`);
        this.setState({ submitting: false });
        if (onSubmit) onSubmit(widget);
      })
      .catch((error) => {
        this.setState({ submitting: false });
        toastr.error('Tnere was an error', error);
      });
  }

  errorValidationWidgetConfig() {
    const { visualizationType } = this.props.widgetEditor;

    switch (visualizationType) {
      case 'chart':
        return toastr.error(
          'Error',
          'Value, Category and Chart type are mandatory fields for a widget visualization.'
        );
      case 'table':
        return toastr.error(
          'Error',
          'Value, Category and Chart type are mandatory fields for a widget visualization.'
        );
      case 'map':
        return toastr.error('Error', 'Layer is mandatory field for a widget visualization.');
      case 'embed':
        return toastr.error('Error', 'Embed url is mandatory field for a widget visualization.');
      default:
        return false;
    }
  }

  handleDelete = () => {
    const { form: { name, dataset, id } } = this.state;
    const { authorization } = this.props;

    toastr.confirm(`Are you sure that you want to delete the widget: "${name}"`, {
      onOk: () => {
        deleteWidget(id, dataset, authorization)
          .then(() => {
            toastr.success('Success', `The widget "${id}" - "${name}" has been removed correctly`);
            Router.pushRoute('admin_data_detail', { tab: 'datasets', subtab: 'widgets', id: dataset });
          })
          .catch((err) => {
            toastr.error(
              'Error',
              `The widget "${id}" - "${name}" was not deleted. Try again. ${err.message}`
            );
          });
      }
    });
  }

  onWidgetSave = (data) => {
    // console.log('onWigetSave', data);
    
  }

  render() {
    const {
      submitting,
      stepLength,
      step,
      loading,
      id,
      form,
      partners,
      datasets,
    } = this.state;
    const { newState } = this.props;
    return (
      <form className="c-form c-widgets-form" noValidate>
        <Spinner isLoading={loading} className="-light" />
        {step === 1 && !loading && (
          <Step1
            id={id}
            form={form}
            partners={partners}
            datasets={datasets}
            onChange={value => this.onChange(value)}
            onSave={this.onWidgetSave}
          />
        )}
      </form>
    );
  }
}

export default WidgetForm;
