import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import { toastr } from 'react-redux-toastr';

// Components
import Navigation from 'components/form/Navigation';
import Step1 from 'components/admin/widgets/metadata/form/steps/Step1';

// Services
import WidgetsService from 'services/WidgetsService';

// Contants
import { STATE_DEFAULT, FORM_ELEMENTS } from 'components/admin/widgets/metadata/form/constants';

class MetadataForm extends React.Component {
  constructor(props) {
    super(props);

    const newState = Object.assign({}, STATE_DEFAULT, {
      metadata: [],
      columns: [],
      loading: !!props.widget,
      loadingColumns: true,
      form: Object.assign({}, STATE_DEFAULT.form, {
        application: props.application,
        authorization: props.authorization
      }),
      dataset: null
    });

    this.state = newState;

    // Services
    this.service = new WidgetsService({
      authorization: props.authorization
    });

    // ----------------- Bindings -----------------------
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onStepChange = this.onStepChange.bind(this);
    // --------------------------------------------------
  }

  componentDidMount() {
    if (this.props.widget) {
      this.service.fetchData({ id: this.props.widget, includes: 'metadata' })
        .then(({ metadata, dataset }) => {
          this.setState({
            form: (metadata && metadata.length) ?
              this.setFormFromParams(metadata[0].attributes) :
              this.state.form,
            metadata,
            dataset,
            // Stop the loading
            loading: false
          });
        })
        .catch((err) => {
          this.setState({ loading: false });
          toastr.error('Error', err);
        });
    }
  }

  /**
   * UI EVENTS
   * - onSubmit
   * - onChange
  */
  onSubmit(event) {
    event.preventDefault();

    // Validate the form
    FORM_ELEMENTS.validate();

    // Set a timeout due to the setState function of react
    setTimeout(() => {
      const valid = FORM_ELEMENTS.isValid();
      if (valid) {
        const { widget } = this.props;
        const { metadata, form, dataset } = this.state;

        // Start the submitting
        this.setState({ submitting: true });

        // Check if the metadata alerady exists
        const thereIsMetadata = Boolean(metadata.find((m) => {
          const hasLang = m.attributes.language === form.language;
          const hasApp = m.attributes.application === form.application;

          return hasLang && hasApp;
        }));

        // Set the request
        const requestOptions = {
          type: (widget && thereIsMetadata) ? 'PATCH' : 'POST',
          omit: ['authorization']
        };

        // Remove the id field
        const formObj = this.state.form;
        formObj.info.widgetLinks = formObj.info.widgetLinks.map(elem =>
          ({ link: elem.link, name: elem.name }));

        // Save the data
        this.service.saveMetadata({
          dataset,
          type: requestOptions.type,
          id: widget,
          body: omit(formObj, requestOptions.omit)
        })
          .then(() => {
            toastr.success('Success', 'Metadata has been uploaded correctly');
            if (this.props.onSubmit) {
              this.props.onSubmit();
            }
          })
          .catch((err) => {
            this.setState({ submitting: false });
            toastr.error('Error', err);
          });
      } else {
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
    const form = Object.keys(this.state.form);
    const newForm = {};

    form.forEach((f) => {
      if (params[f] || this.state.form[f]) {
        newForm[f] = params[f] || this.state.form[f];
      }
    });

    return newForm;
  }

  render() {
    return (
      <div className="c-widget-metadata-form">
        <form className="c-form" onSubmit={this.onSubmit} noValidate>
          {this.state.loading && 'loading'}
          {!this.state.loading &&
            <Step1
              onChange={value => this.onChange(value)}
              form={this.state.form}
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
      </div>
    );
  }
}

MetadataForm.propTypes = {
  widget: PropTypes.string.isRequired,
  application: PropTypes.string.isRequired,
  authorization: PropTypes.string.isRequired,
  onSubmit: PropTypes.func
};

export default MetadataForm;
