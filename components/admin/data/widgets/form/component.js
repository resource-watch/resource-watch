import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import { Router } from 'routes';

// components
import Step1 from 'components/admin/data/widgets/form/steps/Step1';
import Spinner from 'components/ui/Spinner';

// services
import { fetchDatasets } from 'services/dataset';
import {
  fetchWidget,
  deleteWidget,
  updateWidget as updateWidgetService,
  createWidget as createWidgetService,
  createWidgetMetadata,
  updateWidgetMetadata
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
    },
    widgetMetadata: null
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
    if (id) promises.push(fetchWidget(id, { includes: 'metadata' }));

    Promise.all(promises)
      .then((response) => {
        const datasets = response[0];
        const current = response[1];

        this.setState({
          // current widget
          form: id ? this.setFormFromParams(current) : this.state.form,
          loading: false,
          widgetMetadata: id ? current.metadata : null,
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


  onWidgetSave = (_widget) => {
    const { step, form, id } = this.state;
    const { widgetConfig, name, description, metadata } = _widget;
    // Validate the form
    FORM_ELEMENTS.validate(step);

    const valid = FORM_ELEMENTS.isValid(step);
    if (valid) {
      this.setState({ loading: true });
      const formObj = {
        ...form,
        widgetConfig,
        name,
        description,
      };

      if (formObj.sourceUrl === '') {
        delete formObj.sourceUrl;
      }

      // The widget has to be "frozen" first
      // TO-DO: review this
      // if (formObj.freeze && widgetConfig.paramsConfig.visualizationType === 'chart') {
      //   const datasetObj = this.state.datasets.find(d => d.value === form.dataset);
      //   const tempBand = formObj.widgetConfig.paramsConfig
      //     ? formObj.widgetConfig.paramsConfig.band
      //     : null;
      //   getDataURL(
      //     datasetObj.value,
      //     datasetObj.type,
      //     datasetObj.tableName,
      //     tempBand,
      //     datasetObj.provider,
      //     getChartInfo(datasetObj.value, datasetObj.type, datasetObj.provider, widgetEditor),
      //     false,
      //     datasetObj.slug
      //   ).then((dataURL) => {
      //     const sqlSt = dataURL.split('sql=')[1];

      //     fetchQuery(authorization, sqlSt, { freeze: true }).then((resp) => {
      //       const { url } = resp;
      //       formObj.queryUrl = url;
      //       formObj.widgetConfig.data = [
      //         {
      //           format: {
      //             property: 'data',
      //             type: 'json'
      //           },
      //           name: 'table',
      //           url
      //         }
      //       ];

      //       if (id) {
      //         this.updateWidget(formObj);
      //       } else {
      //         this.createWidget(formObj);
      //       }
      //     });
      //   });
      // } else
      if (id) {
        this.updateWidget(formObj, metadata);
      } else {
        this.createWidget(formObj, metadata);
      }
    } else {
      toastr.error('Error', 'Fill all the required fields or correct the invalid values');
    }
  }

  /**
   * UI EVENTS
   * - onChange
   */
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

  createWidget(widget, metadata) {
    const { onSubmit, authorization } = this.props;
    const { form: { dataset } } = this.state;
    createWidgetService(widget, dataset, authorization)
      .then((response) => {
        const { id, name } = response;
        // We need to create the widget metadata now
        createWidgetMetadata(
          id,
          dataset,
          {
            language: 'en',
            info: { caption: metadata.caption }
          },
          authorization
        )
          .then(() => {
            toastr.success('Success', `The widget "${id}" - "${name}" has been created correctly`);
            this.setState({ loading: false });
            if (onSubmit) onSubmit(response);
          });
      })
      .catch((error) => {
        this.setState({ loading: false });
        toastr.error('Tnere was an error', error);
      });
  }

  updateWidget(widget, updatedMetadata) {
    const { onSubmit, authorization } = this.props;
    const { metadata } = widget;

    updateWidgetService(widget, authorization)
      .then((response) => {
        const { id, name, dataset } = response;
        if (metadata && metadata.length) {
          // A metadata object already exists for this widget so we have to update it
          updateWidgetMetadata(
            id,
            dataset,
            {
              language: 'en',
              info: { caption: updatedMetadata.caption },
              application: process.env.APPLICATIONS,
            },
            authorization
          )
            .then(() => {
              toastr.success('Success', `The widget "${id}" - "${name}" has been updated correctly`);
              this.setState({ loading: false });
              if (onSubmit) onSubmit(response);
            });
        } else {
          // There is no metadata for this widget so we need to create it
          createWidgetMetadata(
            id,
            dataset,
            {
              language: 'en',
              info: { caption: metadata.caption },
              application: process.env.APPLICATIONS,
            },
            authorization
          )
            .then(() => {
              toastr.success('Success', `The widget "${id}" - "${name}" has been updated correctly`);
              this.setState({ loading: false });
              if (onSubmit) onSubmit(response);
            });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        toastr.error('Tnere was an error', error);
      });
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

  render() {
    const {
      step,
      loading,
      id,
      form,
      datasets
    } = this.state;
    return (
      <form className="c-form c-widgets-form" noValidate>
        <Spinner isLoading={loading} className="-light" />
        {step === 1 && !loading && (
          <Step1
            id={id}
            form={form}
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
