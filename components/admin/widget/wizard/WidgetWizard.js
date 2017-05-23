import React from 'react';
import omit from 'lodash/omit';

import { STATE_DEFAULT } from './constants';

import Step1 from './steps/step-1';
import Step2 from './steps/step-2';
import Step3 from './steps/step-3';
import Step4 from './steps/step-4';
import Step5 from './steps/step-5';
import Navigation from '../../form/Navigation';

class WidgetWizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = STATE_DEFAULT;

    this.onSubmit = this.onSubmit.bind(this);
    this.onWizardChange = this.onWizardChange.bind(this);
  }

  /**
   * UI EVENTS
   * - onSubmit
   * - onWizardChange
  */
  onWizardChange(obj) {
    const wizard = Object.assign({}, this.state.wizard, obj);
    this.setState({ wizard }, () => console.info(this.state.wizard));
  }

  onSubmit(e) {
    if (e) e.preventDefault();

    // Validate the form
    this.step.validate();

    // Set a timeout due to the setState function of react
    setTimeout(() => {
      const valid = this.step.isValid();
      if (valid) {
        if (this.state.step === this.state.stepLength && !this.state.submitting) {
          // Start the submitting
          this.setState({ submitting: true });

          // Set the request
          // Send the request
          const xmlhttp = new XMLHttpRequest();
          const xmlhttpOptions = {
            type: (this.state.dataset && this.state.widget) ? 'PATCH' : 'POST',
            authorization: this.state.form.authorization,
            contentType: 'application/json',
            omit: ['authorization']
          };
          xmlhttp.open(xmlhttpOptions.type, `https://api.resourcewatch.org/v1/dataset/${this.state.dataset}/widget/${this.state.widget || ''}`);
          xmlhttp.setRequestHeader('Content-Type', xmlhttpOptions.contentType);
          xmlhttp.setRequestHeader('Authorization', xmlhttpOptions.authorization);
          xmlhttp.send(JSON.stringify({
            // Remove unnecesary atributtes to prevent 'Unprocessable Entity error'
            widget: omit(this.state.form, xmlhttpOptions.omit)
          }));

          xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState === 4) {
              // Stop the submitting
              this.setState({ submitting: false });

              if (xmlhttp.status === 200 || xmlhttp.status === 201) {
                const response = JSON.parse(xmlhttp.responseText);
                const successMessage = `The widget "${response.data.id}" - "${response.data.attributes.name}" has been uploaded correctly`;
                console.info(response);
                console.info(successMessage);
                alert(successMessage);

                // Go back to first step and set the dataset
                // This will trigger the PATCH function
                this.setState({
                  step: 1,
                  widget: response.data.id
                });
              } else {
                console.info('Error');
              }
            }
          };
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
    return (
      <form className="c-form" onSubmit={this.onSubmit} noValidate>
        {this.state.step === 1 &&
          <Step1
            ref={(c) => { this.step = c; }}
            wizard={this.state.wizard}
            onChange={(value) => {
              this.onWizardChange(value);
              this.onSubmit();
            }}
          />
        }

        {this.state.step === 2 &&
          <Step2
            ref={(c) => { this.step = c; }}
            wizard={this.state.wizard}
            onChange={(value) => {
              this.onWizardChange(value);
              this.onSubmit();
            }}
          />
        }

        {this.state.step === 3 &&
          <Step3
            ref={(c) => { this.step = c; }}
            wizard={this.state.wizard}
            onChange={(value) => {
              this.onWizardChange(value);
            }}
          />
        }

        {this.state.step === 4 &&
          <Step4
            ref={(c) => { this.step = c; }}
            wizard={this.state.wizard}
            onChange={(value) => {
              this.onWizardChange(value);
            }}
          />
        }

        {this.state.step === 5 &&
          <Step5
            ref={(c) => { this.step = c; }}
            wizard={this.state.wizard}
            onChange={(value) => {
              this.onWizardChange(value);
            }}
          />
        }

        {!this.state.loading &&
          <Navigation
            step={this.state.step}
            stepLength={this.state.stepLength}
            submitting={this.state.submitting}
            onBack={step => this.setStep(step)}
          />
        }
      </form>
    );
  }
}

WidgetWizard.propTypes = {
  application: React.PropTypes.array,
  authorization: React.PropTypes.string
};

export default WidgetWizard;
