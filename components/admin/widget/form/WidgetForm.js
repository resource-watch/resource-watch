import React from 'react';
import omit from 'lodash/omit';

// Components
import Step1 from 'components/admin/widget/form/steps/Step1';
import Navigation from 'components/form/Navigation';

// Store
import { STATE_DEFAULT, FORM_ELEMENTS } from 'components/admin/widget/form/constants';

// Utils
import { get, post } from 'utils/request';

class WidgetForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, STATE_DEFAULT, {
      loading: !!props.widget,
      widget: props.widget,
      form: Object.assign({}, STATE_DEFAULT.form, {
        application: props.application,
        authorization: props.authorization
      })
    });

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    if (this.state.widget) {
      get({
        url: `${process.env.WRI_API_URL}/widget/${this.state.widget}?cache=${Date.now()}`,
        headers: [{
          key: 'Content-Type',
          value: 'application/json'
        }],
        onSuccess: (response) => {
          this.setState({
            form: this.setFormFromParams(omit(response.data.attributes, ['status', 'published', 'verified'])),
            // Stop the loading
            loading: false,
            dataset: response.data.attributes.dataset
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
          type: this.state.widget ? 'PATCH' : 'POST',
          url: `${process.env.WRI_API_URL}/widget/${this.state.widget || ''}`,
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

            if (this.props.onSubmit) this.props.onSubmit();
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

WidgetForm.propTypes = {
  application: React.PropTypes.array,
  authorization: React.PropTypes.string,
  widget: React.PropTypes.string,
  onSubmit: React.PropTypes.func
};

export default WidgetForm;
