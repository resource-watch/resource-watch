import React from 'react';

import { STATE_DEFAULT, FORM_ELEMENTS } from './constants';
import { get, post } from 'utils/request';


import Step1 from './steps/step-1';
import Step2 from './steps/step-2';
import Step3 from './steps/step-3';
import Navigation from 'components/form/Navigation';

class WidgetWizard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...STATE_DEFAULT,
      form: {
        ...STATE_DEFAULT.form,
        application: props.application
      }
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onFormChange = this.onFormChange.bind(this);
    this.onWizardChange = this.onWizardChange.bind(this);
  }

  componentWillMount() {
    if (this.props.dataset) {
      // Start the loading
      this.setState({ loading: true });

      get({
        url: `https://api.resourcewatch.org/v1/dataset/${this.props.dataset}`,
        headers: [{
          key: 'Content-Type',
          value: 'application/json'
        }],
        onSuccess: (response) => {
          this.setState({
            dataset: {
              id: response.data.id,
              ...response.data.attributes
            },
            // Stop the loading
            loading: false
          });
        },
        onError: (error) => {
          this.setState({ loading: false });
          console.error(error);
        }
      });
    }
  }

  /**
   * UI EVENTS
   * - onFormChange
   * - onWizardChange
   * - onSubmit
  */

  onFormChange(obj) {
    const form = Object.assign({}, this.state.form, obj);
    this.setState({ form }, () => console.info(this.state.form));
  }

  onWizardChange(obj) {
    const wizard = Object.assign({}, this.state.wizard, obj);
    this.setState({ wizard }, () => console.info(this.state.wizard));
  }

  onSubmit(e) {
    if (e) e.preventDefault();

    // Validate the form
    FORM_ELEMENTS.validate(this.state.step);

    // Set a timeout due to the setState function of react
    setTimeout(() => {
      const valid = FORM_ELEMENTS.isValid(this.state.step);
      if (valid) {
        if (this.state.step === this.state.stepLength && !this.state.submitting) {
          // Start the submitting
          this.setState({ submitting: true });

          post({
            type: (this.state.dataset && this.state.widget) ? 'PATCH' : 'POST',
            url: `https://api.resourcewatch.org/v1/dataset/${this.state.dataset.id}/widget/${this.state.widget || ''}`,
            body: this.state.form,
            headers: [{
              key: 'Content-Type',
              value: 'application/json'
            }, {
              key: 'Authorization',
              value: this.props.authorization
            }],
            onSuccess: (response) => {
              console.info(response);
              alert('upload widget correctly');
            },
            onError: (error) => {
              this.setState({ submitting: false, loading: false });
              console.error(error);
            }
          });
        } else {
          this.setState({
            step: this.state.step + 1
          }, () => console.info(this.state));
        }
      }
    }, 0);
  }

  /**
   * HELPERS
   * - setStep
   * - setFormFromParams
  */
  setStep(step) {
    this.setState({ step });
  }

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

  /**
   * RENDER
  */
  render() {
    const { dataset, form, wizard, step, stepLength, submitting, loading } = this.state;

    return (
      <form className="c-form" onSubmit={this.onSubmit} noValidate>
        {step === 1 && !!dataset &&
          <Step1
            dataset={dataset}
            form={form}
            onChange={(value) => {
              this.onFormChange(value);
            }}
          />
        }

        {step === 2 && !!dataset &&
          <Step2
            dataset={dataset}
            wizard={wizard}
            onChange={(value) => {
              this.onWizardChange(value);
            }}
          />
        }

        {step === 3 && !!dataset &&
          <Step3
            dataset={dataset}
            wizard={wizard}
            onChange={(value) => {
              this.onFormChange(value);
            }}
          />
        }

        {!loading &&
          <Navigation
            step={step}
            stepLength={stepLength}
            submitting={submitting}
            onStepChange={s => this.setStep(s)}
          />
        }
      </form>
    );
  }
}

WidgetWizard.propTypes = {
  dataset: React.PropTypes.string.isRequired,
  application: React.PropTypes.array,
  authorization: React.PropTypes.string
};

export default WidgetWizard;
