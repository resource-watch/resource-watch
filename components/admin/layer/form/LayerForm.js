import React from 'react';
import omit from 'lodash/omit';

import { STATE_DEFAULT } from './constants';

import Step1 from './steps/step-1';
import Navigation from '../../form/Navigation';

class LayerForm extends React.Component {
  constructor(props) {
    super(props);
    const newState = Object.assign({}, STATE_DEFAULT, {
      dataset: props.dataset,
      layer: props.layer,
      form: Object.assign({}, STATE_DEFAULT.form, {
        application: props.application,
        authorization: props.authorization
      })
    });

    this.state = newState;

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    if (this.state.dataset && this.state.layer) {
      // Start the loading
      this.setState({ loading: true });

      const xmlhttp = new XMLHttpRequest();
      xmlhttp.open('GET', `https://api.resourcewatch.org/v1/dataset/${this.state.dataset}/layer/${this.state.layer}?cache=${Date.now()}`);
      xmlhttp.setRequestHeader('Content-Type', 'application/json');
      xmlhttp.setRequestHeader('Authorization', this.state.form.authorization);
      xmlhttp.send();

      xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState === 4) {
          if (xmlhttp.status === 200 || xmlhttp.status === 201) {
            const response = JSON.parse(xmlhttp.responseText);
            this.setState({
              form: this.setFormFromParams(response.data.attributes),
              // Stop the loading
              loading: false
            });
          } else {
            console.info('Error');
          }
        }
      };
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
            type: (this.state.dataset && this.state.layer) ? 'PATCH' : 'POST',
            authorization: this.state.form.authorization,
            contentType: 'application/json',
            omit: ['authorization']
          };

          xmlhttp.open(xmlhttpOptions.type, `https://api.resourcewatch.org/v1/dataset/${this.state.dataset}/layer/${this.state.layer || ''}`);
          xmlhttp.setRequestHeader('Content-Type', xmlhttpOptions.contentType);
          xmlhttp.setRequestHeader('Authorization', xmlhttpOptions.authorization);
          xmlhttp.send(JSON.stringify({
            // Remove unnecesary atributtes to prevent 'Unprocessable Entity error'
            layer: omit(this.state.form, xmlhttpOptions.omit)
          }));

          xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState === 4) {
              // Stop the submitting
              this.setState({ submitting: false });

              if (xmlhttp.status === 200 || xmlhttp.status === 201) {
                const response = JSON.parse(xmlhttp.responseText);
                const successMessage = `The layer "${response.data.id}" - "${response.data.attributes.name}" has been uploaded correctly`;
                console.info(response);
                console.info(successMessage);
                alert(successMessage);

                // Go back to first step and set the dataset
                // This will trigger the PATCH function
                this.setState({
                  step: 1,
                  layer: response.data.id
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

  onChange(obj) {
    const form = Object.assign({}, this.state.form, obj);
    this.setState({ form }, () => console.info(this.state.form));
  }

  onBack(step) {
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
      <form className="c-form" onSubmit={this.onSubmit} noValidate>
        {this.state.loading && 'loading'}
        {(this.state.step === 1 && !this.state.loading) &&
          <Step1
            ref={(c) => { this.step = c; }}
            onChange={value => this.onChange(value)}
            form={this.state.form}
            dataset={this.state.dataset}
          />
        }

        {!this.state.loading &&
          <Navigation
            step={this.state.step}
            stepLength={this.state.stepLength}
            submitting={this.state.submitting}
            onBack={step => this.onBack(step)}
          />
        }
      </form>
    );
  }
}

LayerForm.propTypes = {
  application: React.PropTypes.array,
  authorization: React.PropTypes.string,
  dataset: React.PropTypes.string.isRequired,
  layer: React.PropTypes.string
};

export default LayerForm;
