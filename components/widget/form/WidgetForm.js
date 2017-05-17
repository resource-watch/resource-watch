import React from 'react';
import omit from 'lodash/omit';

import { STATE_DEFAULT, FORM_ELEMENTS } from './constants';

import { get, post } from '../../../utils/request';

import Step1 from './steps/Step1';
import Navigation from '../../form/Navigation';

class WidgetForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, STATE_DEFAULT, {
      dataset: props.dataset,
      widget: props.widget,
      form: Object.assign({}, STATE_DEFAULT.form, {
        application: props.application,
        authorization: props.authorization
      })
    });

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    if (this.state.dataset && this.state.widget) {
      // Start the loading
      this.setState({ loading: true });

      get({
        url: `https://api.resourcewatch.org/v1/dataset/${this.state.dataset}/widget/${this.state.widget}?cache=${Date.now()}`,
        headers: [{
          key: 'Content-Type',
          value: 'application/json'
        }],
        onSuccess: (response) => {
          this.setState({
            form: this.setFormFromParams(omit(response.data.attributes, ['status', 'published', 'verified'])),
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
    FORM_ELEMENTS.validate();

    // Set a timeout due to the setState function of react
    setTimeout(() => {
      const valid = FORM_ELEMENTS.isValid();

      if (valid) {
        // Start the submitting
        this.setState({ submitting: true });

        post({
          type: (this.state.dataset && this.state.widget) ? 'PATCH' : 'POST',
          url: `https://api.resourcewatch.org/v1/dataset/${this.state.dataset}/widget/${this.state.widget || ''}`,
          body: omit(this.state.form, ['authorization']),
          headers: [{
            key: 'Content-Type',
            value: 'application/json'
          }, {
            key: 'Authorization',
            value: this.state.form.authorization
          }],
          onSuccess: () => {
            const successMessage = 'Widget has been uploaded correctly';
            alert(successMessage);

            this.props.onSubmit && this.props.onSubmit();
          },
          onError: (error) => {
            this.setState({ loading: false });
            console.error(error);
          }
        });
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

WidgetForm.propTypes = {
  application: React.PropTypes.array,
  authorization: React.PropTypes.string,
  dataset: React.PropTypes.string.isRequired,
  widget: React.PropTypes.string,
  onSubmit: React.PropTypes.func
};

export default WidgetForm;
