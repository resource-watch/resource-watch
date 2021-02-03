import React from 'react';
import PropTypes from 'prop-types';

// Services
import { updatePage, createPage, fetchPage } from 'services/pages';
import { toastr } from 'react-redux-toastr';

import { STATE_DEFAULT, FORM_ELEMENTS } from 'components/admin/pages/form/constants';

// Components
import Navigation from 'components/form/Navigation';
import Step1 from 'components/admin/pages/form/steps/Step1';
import Spinner from 'components/ui/Spinner';

class PagesForm extends React.Component {
  static propTypes = {
    authorization: PropTypes.string.isRequired,
    id: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = { id: null };

  state = ({
    ...STATE_DEFAULT,
    id: this.props.id,
    loading: !!this.props.id,
    form: STATE_DEFAULT.form,
  });

  componentDidMount() {
    const { id } = this.state;
    // Get the pages and fill the
    // state form with its params if the id exists
    if (id) {
      fetchPage(id)
        .then((data) => {
          this.setState({
            form: this.setFormFromParams(data),
            // Stop the loading
            loading: false,
          });
        })
        .catch((err) => {
          toastr.error('Error', err);
        });
    }
  }

  /**
   * UI EVENTS
   * - onSubmit
   * - onChange
   * - onStepChange
  */
  onSubmit = (event) => {
    const {
      step, submitting, id, stepLength, form,
    } = this.state;
    const { authorization, onSubmit } = this.props;
    event.preventDefault();

    // Validate the form
    FORM_ELEMENTS.validate(step);

    // Set a timeout due to the setState function of react
    setTimeout(() => {
      // Validate all the inputs on the current step
      const valid = FORM_ELEMENTS.isValid(step);

      if (valid) {
        // if we are in the last step we will submit the form
        if (step === stepLength && !submitting) {
          // Start the submitting
          this.setState({ submitting: true });

          // Update page
          if (id) {
            updatePage(form, authorization)
              .then((data) => {
                toastr.success('Success', `The page "${data.id}" - "${data.title}" has been updated correctly`);
                if (onSubmit) onSubmit();
              })
              .catch((err) => {
                this.setState({ submitting: false });
                toastr.error(`There was an error updating the page: ${id}" - "${form.title}`, err);
              });
          // Create page
          } else {
            createPage(form, authorization)
              .then((data) => {
                toastr.success('Success', `The page ${data.title}" has been created correctly`);
                if (onSubmit) onSubmit();
              })
              .catch((err) => {
                this.setState({ submitting: false });
                toastr.error(`There was an error creating the page: ${form.title}`, err);
              });
          }
        } else {
          this.setState({ step: step + 1 });
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
    const newForm = {};

    Object.keys(params).forEach((f) => {
      switch (f) {
        // TODO: if the API doesn't send it we won't need to handle it
        case 'photo': {
          if (params[f] && params[f].original !== '/images/original/missing.png') {
            newForm[f] = params[f].original;
          }
          break;
        }
        default: {
          if ((typeof params[f] !== 'undefined' || params[f] !== null)
            || (typeof this.state.form[f] !== 'undefined' || this.state.form[f] !== null)) {
            newForm[f] = params[f] || this.state.form[f];
          }
        }
      }
    });

    return newForm;
  }

  render() {
    return (
      <form className="c-form" onSubmit={this.onSubmit} noValidate>
        <Spinner isLoading={this.state.loading} className="-light" />

        {(this.state.step === 1 && !this.state.loading)
          && (
          <Step1
            onChange={(value) => this.onChange(value)}
            form={this.state.form}
            id={this.state.id}
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
    );
  }
}

export default PagesForm;
