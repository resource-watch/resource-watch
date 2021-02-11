import React from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

// Components
import Navigation from 'components/form/Navigation';
import Step1 from 'components/widgets/metadata/form/steps/Step1';

// Services
import {
  fetchWidget,
  updateWidgetMetadata,
  createWidgetMetadata,
} from 'services/widget';

// Contants
import { STATE_DEFAULT, FORM_ELEMENTS } from 'components/widgets/metadata/form/constants';

class MetadataForm extends React.Component {
  static propTypes = {
    widget: PropTypes.string.isRequired,
    authorization: PropTypes.string.isRequired,
    application: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  state = ({
    ...STATE_DEFAULT,
    metadata: [],
    columns: [],
    loading: !!this.props.widget,
    loadingColumns: true,
    form: {
      ...STATE_DEFAULT.form,
      application: this.props.application,
      authorization: this.props.authorization,
    },
    dataset: null,
  });

  UNSAFE_componentWillMount() {
    const { widget } = this.props;
    if (widget) {
      fetchWidget(widget, { includes: 'metadata' })
        .then(({ metadata, dataset }) => {
          this.setState({
            form: (metadata && metadata.length)
              ? this.setFormFromParams(metadata[0])
              : this.state.form,
            metadata,
            dataset,
            // Stop the loading
            loading: false,
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
  onSubmit = (event) => {
    event.preventDefault();

    // Validate the form
    FORM_ELEMENTS.validate();

    // Set a timeout due to the setState function of react
    setTimeout(() => {
      const valid = FORM_ELEMENTS.isValid();
      if (valid) {
        const { widget, authorization } = this.props;
        const { metadata, form, dataset } = this.state;

        // Start the submitting
        this.setState({ submitting: true });

        // Check if the metadata alerady exists
        const thereIsMetadata = Boolean(metadata.find((m) => {
          const hasLang = m.language === form.language;
          const hasApp = m.application === form.application;

          return hasLang && hasApp;
        }));

        // Remove the id field
        const formObj = this.state.form;
        formObj.info.widgetLinks = formObj.info.widgetLinks.map((elem) => ({ link: elem.link, name: elem.name }));

        if (widget && thereIsMetadata) {
          updateWidgetMetadata(widget, dataset, formObj, authorization)
            .then(() => {
              toastr.success('Success', 'Metadata has been updated correctly');
              if (this.props.onSubmit) {
                this.props.onSubmit();
              }
            })
            .catch((err) => {
              this.setState({ submitting: false });
              toastr.error('Error', err);
            });
        } else {
          createWidgetMetadata(widget, dataset, formObj, authorization)
            .then(() => {
              toastr.success('Success', 'Metadata has been updated correctly');
              if (this.props.onSubmit) {
                this.props.onSubmit();
              }
            })
            .catch((err) => {
              this.setState({ submitting: false });
              toastr.error('Error', err);
            });
        }
      } else {
        toastr.error('Error', 'Fill all the required fields or correct the invalid values');
      }
    }, 0);
  }

  onChange = (obj) => {
    const form = { ...this.state.form, ...obj };
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
          {!this.state.loading
            && (
            <Step1
              onChange={(value) => this.onChange(value)}
              form={this.state.form}
            />
            )}

          {!this.state.loading
            && (
            <Navigation
              step={this.state.step}
              stepLength={this.state.stepLength}
              submitting={this.state.submitting}
              onStepChange={this.onStepChange}
            />
            )}
        </form>
      </div>
    );
  }
}

export default MetadataForm;
