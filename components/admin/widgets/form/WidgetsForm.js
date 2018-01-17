import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

// Services
import WidgetsService from 'services/WidgetsService';
import DatasetsService from 'services/DatasetsService';
import LayersService from 'services/LayersService';

import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';

import {
  resetWidgetEditor
} from 'components/widgets/editor/redux/widgetEditor';

// Constants
import { STATE_DEFAULT, FORM_ELEMENTS } from 'components/admin/widgets/form/constants';

// Components
import Navigation from 'components/form/Navigation';
import Step1 from 'components/admin/widgets/form/steps/Step1';
import Spinner from 'components/ui/Spinner';

// Utils
import { getDataURL, getChartInfo } from 'utils/widgets/WidgetHelper';

class WidgetsForm extends React.Component {
  constructor(props) {
    super(props);

    const formObj = props.dataset ?
      Object.assign({}, STATE_DEFAULT.form, { dataset: props.dataset }) :
      STATE_DEFAULT.form;

    this.state = Object.assign({}, STATE_DEFAULT, {
      id: props.id,
      loading: !!props.id,
      form: formObj,
      mode: 'editor'
    });

    // BINDINGS
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleModeChange = this.handleModeChange.bind(this);
    this.onStepChange = this.onStepChange.bind(this);

    this.service = new WidgetsService({
      authorization: props.authorization
    });

    this.datasetsService = new DatasetsService({
      authorization: props.authorization,
      language: props.locale
    });
  }

  componentWillMount() {
    // If the user wants to create a new widget, we make
    // sure that the name of the previous widget the
    // user saw is not leaking in this new form
    if (!this.props.id) {
      this.props.resetWidgetEditor();
    }
  }

  componentDidMount() {
    const { id } = this.state;

    const promises = [
      this.datasetsService.fetchAllData({})
    ];

    // Add the dashboard promise if the id exists
    if (id) {
      promises.push(this.service.fetchData({ id }));
    }

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
          dataset: current,
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
        toastr.error(err);
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
                const url = resp.url;
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
          this.setState({
            step: this.state.step + 1
          });
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
    // Save data
    this.service.saveData(obj)
      .then((data) => {
        toastr.success('Success', `The widget "${data.id}" - "${data.name}" has been uploaded correctly`);

        if (this.props.onSubmit) this.props.onSubmit();
      })
      .catch((errors) => {
        this.setState({ submitting: false });

        try {
          errors.forEach(er =>
            toastr.error('Error', er.detail)
          );
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

WidgetsForm.defaultProps = {
  showEditor: true
};

WidgetsForm.propTypes = {
  authorization: PropTypes.string,
  id: PropTypes.string,
  onSubmit: PropTypes.func,
  dataset: PropTypes.string, // ID of the dataset that should be pre-selected
  showEditor: PropTypes.bool,
  // Store
  widgetEditor: PropTypes.object,
  locale: PropTypes.string.isRequired,
  // ACTIONS
  resetWidgetEditor: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  resetWidgetEditor: () => dispatch(resetWidgetEditor())
});

const mapStateToProps = state => ({
  widgetEditor: state.widgetEditor,
  locale: state.common.locale
});

export default connect(mapStateToProps, mapDispatchToProps)(WidgetsForm);
