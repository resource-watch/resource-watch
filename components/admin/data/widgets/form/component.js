import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'react-fast-compare';
import { toastr } from 'react-redux-toastr';

// components
import Navigation from 'components/form/Navigation';
import Step1 from 'components/admin/data/widgets/form/steps/Step1';
import Spinner from 'components/ui/Spinner';

// services
import WidgetsService from 'services/WidgetsService';
import { fetchDatasets } from 'services/dataset';
import { fetchWidget } from 'services/widget';

// utils
import { getDataURL, getChartInfo } from 'utils/widgets/WidgetHelper';

// constants
import { STATE_DEFAULT, FORM_ELEMENTS } from './constants';


class WidgetForm extends PureComponent {
  static propTypes = {
    authorization: PropTypes.string.isRequired,
    id: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    showEditor: PropTypes.bool,
    widgetEditor: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired
  };

  static defaultProps = {
    id: null,
    // dataset: null,
    showEditor: true
  };

  constructor(props) {
    super(props);

    this.state = Object.assign({}, STATE_DEFAULT, {
      id: props.id,
      loading: !!props.id,
      form: STATE_DEFAULT.form,
      mode: 'editor'
    });

    // BINDINGS
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleModeChange = this.handleModeChange.bind(this);
    this.onStepChange = this.onStepChange.bind(this);

    this.service = new WidgetsService({ authorization: props.authorization });
  }

  componentDidMount() {
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

        // Set advanced mode if paramsConfig doesn't exist or if it's empty
        const mode = (
          current &&
          (!current.widgetConfig.paramsConfig || isEmpty(current.widgetConfig.paramsConfig))
        ) ? 'advanced' : 'editor';
        this.setState({
          // CURRENT DASHBOARD
          form: (id) ? this.setFormFromParams(current) : this.state.form,
          loading: false,
          mode,
          // OPTIONS
          datasets: datasets.map(p => ({
            label: p.name,
            value: p.id,
            type: p.type,
            tableName: p.tableName,
            slug: p.slug
          }))
        });
      })
      .catch((err) => {
        this.setState({ loading: false }, () => { toastr.error('Something went wrong', err.message); });
      });
  }

  /**
   * UI EVENTS
   * - onSubmit
   * - onChange
   * - handleModeChange
  */
  onSubmit(event) {
    const { submitting, stepLength, step, form, mode } = this.state;
    const { widgetEditor } = this.props;
    event.preventDefault();

    // Validate the form
    FORM_ELEMENTS.validate(step);

    // Set a timeout due to the setState function of react
    setTimeout(async () => {
      const widgetConfig = (this.onGetWidgetConfig) ? await this.getWidgetConfig() : {};
      // Validate all the inputs on the current step
      const validWidgetConfig = (mode === 'editor') ? this.validateWidgetConfig() : true;
      const valid = FORM_ELEMENTS.isValid(step) && validWidgetConfig;
      if (valid) {
        // if we are in the last step we will submit the form
        if (step === stepLength && !submitting) {
          const { id } = this.state;

          // Start the submission
          this.setState({ submitting: true });
          const formObj = (mode === 'editor') ? { ...form, widgetConfig } : form;

          const obj = {
            dataset: form.dataset,
            id: id || '',
            type: (id) ? 'PATCH' : 'POST',
            body: formObj
          };

          if (obj.body.sourceUrl === '') {
            delete obj.body.sourceUrl;
          }

          // The widget has to be "frozen" first
          if (formObj.freeze) {
            const datasetObj = this.state.datasets.find(d => d.value === form.dataset);
            const tempBand = formObj.widgetConfig.paramsConfig ?
              formObj.widgetConfig.paramsConfig.band : null;
            getDataURL(
              datasetObj.value,
              datasetObj.type,
              datasetObj.tableName,
              tempBand,
              datasetObj.provider,
              getChartInfo(
                datasetObj.value,
                datasetObj.type,
                datasetObj.provider,
                widgetEditor
              ),
              false,
              datasetObj.slug
            ).then((dataURL) => {
              const sqlSt = dataURL.split('sql=')[1];
              this.service.freezeWidget(sqlSt).then((resp) => {
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
                obj.body = formObj;
                this.saveWidget(obj);
              });
            });
          } else {
            this.saveWidget(obj);
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

  onChange(obj) {
    const form = Object.assign({}, this.state.form, obj);
    this.setState({ form });
  }

  onStepChange(step) {
    this.setState({ step });
  }

  // HELPERS
  setFormFromParams(params) {
    const newForm = {};

    Object.keys(params).forEach((f) => {
      switch (f) {
        default: {
          if ((typeof params[f] !== 'undefined' || params[f] !== null) ||
              (typeof this.state.form[f] !== 'undefined' || this.state.form[f] !== null)) {
            newForm[f] = params[f] || this.state.form[f];
          }
        }
      }
    });

    return newForm;
  }

  getWidgetConfig() {
    return this.onGetWidgetConfig()
      .then(widgetConfig => widgetConfig)
      .catch(() => ({}));
  }

  saveWidget(obj) {
    const { onSubmit } = this.props;
    // Save data
    this.service.saveData(obj)
      .then((widget) => {
        const { id, name } = widget;
        toastr.success('Success', `The widget "${id}" - "${name}" has been uploaded correctly`);

        if (onSubmit) onSubmit(widget);
      })
      .catch((errors) => {
        this.setState({ submitting: false });

        try {
          errors.forEach(er => toastr.error('Error', er.detail));
        } catch (e) {
          toastr.error('Error', 'Oops! There was an error, try again.');
        }
      });
  }

  validateWidgetConfig() {
    const { value, category, chartType, visualizationType, layer, embed } = this.props.widgetEditor;

    switch (visualizationType) {
      case 'chart':
        return !!chartType && !!category && !!value;
      case 'table':
        return !!chartType && !!category && !!value;
      case 'map':
        return !!layer;
      case 'embed':
        return !!embed.src;
      default:
        return false;
    }
  }

  errorValidationWidgetConfig() {
    const { visualizationType } = this.props.widgetEditor;

    switch (visualizationType) {
      case 'chart':
        return toastr.error('Error', 'Value, Category and Chart type are mandatory fields for a widget visualization.');
      case 'table':
        return toastr.error('Error', 'Value, Category and Chart type are mandatory fields for a widget visualization.');
      case 'map':
        return toastr.error('Error', 'Layer is mandatory field for a widget visualization.');
      case 'embed':
        return toastr.error('Error', 'Embed url is mandatory field for a widget visualization.');
      default:
        return false;
    }
  }

  handleModeChange(value) {
    // We have to set the defaultEditableWidget to false if the mode has been changed
    // to 'advanced'
    const newForm = (value === 'advanced') ?
      Object.assign({}, this.state.form, { defaultEditableWidget: false })
      : this.state.form;

    this.setState({
      form: newForm,
      mode: value
    });
  }

  render() {
    return (
      <form className="c-form c-widgets-form" onSubmit={this.onSubmit} noValidate>
        <Spinner isLoading={this.state.loading} className="-light" />

        {(this.state.step === 1 && !this.state.loading) &&
          <Step1
            id={this.state.id}
            form={this.state.form}
            partners={this.state.partners}
            datasets={this.state.datasets}
            mode={this.state.mode}
            onChange={value => this.onChange(value)}
            onModeChange={this.handleModeChange}
            showEditor={this.props.showEditor}
            onGetWidgetConfig={(func) => { this.onGetWidgetConfig = func; }}
          />
        }

        {!this.state.loading &&
          <Navigation
            step={this.state.step}
            stepLength={this.state.stepLength}
            submitting={this.state.submitting}
            onStepChange={this.onStepChange}
          />
        }
      </form>
    );
  }
}


export default WidgetForm;
