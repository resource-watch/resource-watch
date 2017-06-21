import React from 'react';
import omit from 'lodash/omit';

import { get, post } from 'utils/request';

import { STATE_DEFAULT, FORM_ELEMENTS } from './constants';

import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Navigation from 'components/form/Navigation';

class DatasetForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({}, STATE_DEFAULT, {
      dataset: props.dataset,
      form: Object.assign({}, STATE_DEFAULT.form, {
        application: props.application,
        authorization: props.authorization
      })
    });

    // BINDINGS
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onStepChange = this.onStepChange.bind(this);
  }

  componentDidMount() {
    if (this.state.dataset) {
      // Start the loading
      this.setState({ loading: true });

      get({
        url: `${process.env.WRI_API_URL}/dataset/${this.state.dataset}`,
        headers: [{
          key: 'Content-Type',
          value: 'application/json'
        }],
        onSuccess: (response) => {
          this.setState({
            dataset: response.data.id,
            form: this.setFormFromParams(response.data.attributes),
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
   * - onSubmit
   * - onChange
  */
  onSubmit(event) {
    event.preventDefault();

    // Validate the form
    FORM_ELEMENTS.validate(this.state.step);

    // Set a timeout due to the setState function of react
    setTimeout(() => {
      const valid = FORM_ELEMENTS.isValid(this.state.step);
      if (valid) {
        if (this.state.step === this.state.stepLength && !this.state.submitting) {
          const dataset = this.state.dataset;

          // Start the submitting
          this.setState({ submitting: true });

          // Set the request
          const requestOptions = {
            type: (dataset) ? 'PATCH' : 'POST',
            omit: (dataset) ? ['connectorUrlHint', 'authorization', 'connectorType', 'provider'] : ['connectorUrlHint', 'authorization']
          };

          post({
            type: requestOptions.type,
            url: `${process.env.WRI_API_URL}/dataset/${dataset || ''}`,
            body: omit(this.state.form, requestOptions.omit),
            headers: [{
              key: 'Content-Type', value: 'application/json'
            }, {
              key: 'Authorization', value: this.state.form.authorization
            }],
            onSuccess: (response) => {
              const successMessage = `The dataset "${response.data.id}" - "${response.data.attributes.name}" has been uploaded correctly`;
              alert(successMessage);

              this.props.onSubmit && this.props.onSubmit();
            },
            onError: (error) => {
              this.setState({ submitting: false });
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

  onChange(obj) {
    const form = Object.assign({}, this.state.form, obj);
    this.setState({ form }, () => console.info(this.state.form));
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
      <form className="c-form" onSubmit={this.onSubmit} noValidate>
        {this.state.loading && 'loading'}
        {(this.state.step === 1 && !this.state.loading) &&
          <Step1
            onChange={value => this.onChange(value)}
            form={this.state.form}
            dataset={this.state.dataset}
          />
        }

        {(this.state.step === 2 && !this.state.loading) &&
          <Step2
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
            onStepChange={this.onStepChange}
          />
        }
      </form>
    );
  }
}

DatasetForm.propTypes = {
  application: React.PropTypes.array,
  authorization: React.PropTypes.string,
  dataset: React.PropTypes.string,
  onSubmit: React.PropTypes.func
};

export default DatasetForm;
