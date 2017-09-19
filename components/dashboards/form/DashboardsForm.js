import React from 'react';
import PropTypes from 'prop-types';
import { Serializer } from 'jsonapi-serializer';
import { toastr } from 'react-redux-toastr';

// Services
import DashboardsService from 'services/DashboardsService';

import { STATE_DEFAULT, FORM_ELEMENTS } from 'components/dashboards/form/constants';

import Navigation from 'components/form/Navigation';
import Step1 from 'components/dashboards/form/steps/Step1';
import Spinner from 'components/ui/Spinner';

class DashboardsForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({}, STATE_DEFAULT, {
      id: props.id,
      loading: !!props.id,
      form: {
        ...STATE_DEFAULT.form,
        user_id: props.user.id
      }
    });

    // BINDINGS
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onStepChange = this.onStepChange.bind(this);

    this.service = new DashboardsService({
      authorization: props.user.token
    });
  }

  componentDidMount() {
    const { id } = this.state;
    // Get the dashboards and fill the
    // state form with its params if the id exists
    if (id) {
      this.service.fetchData({ id })
        .then((data) => {
          this.setState({
            form: this.setFormFromParams(data),
            // Stop the loading
            loading: false
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
  */
  onSubmit(event) {
    event.preventDefault();

    // Validate the form
    FORM_ELEMENTS.validate(this.state.step);

    // Set a timeout due to the setState function of react
    setTimeout(() => {
      // Validate all the inputs on the current step
      const valid = FORM_ELEMENTS.isValid(this.state.step);

      if (valid) {
        // if we are in the last step we will submit the form
        if (this.state.step === this.state.stepLength && !this.state.submitting) {
          const { id } = this.state;

          // Start the submitting
          this.setState({ submitting: true });

          // Save data
          this.service.saveData({
            id: id || '',
            type: (id) ? 'PATCH' : 'POST',
            body: new Serializer('dashboard', {
              keyForAttribute: 'dash-case',
              attributes: Object.keys(this.state.form)
            }).serialize(this.state.form)
          })
            .then((data) => {
              toastr.success('Success', `The dashboard "${data.id}" - "${data.name}" has been uploaded correctly`);

              if (this.props.onSubmit) this.props.onSubmit();
            })
            .catch((err) => {
              this.setState({ submitting: false });
              toastr.error('Error', `Oops! There was an error, try again. ${err}`);
            });
        } else {
          this.setState({
            step: this.state.step + 1
          });
        }
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
          if ((typeof params[f] !== 'undefined' || params[f] !== null) ||
              (typeof this.state.form[f] !== 'undefined' || this.state.form[f] !== null)) {
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

        {(this.state.step === 1 && !this.state.loading) &&
          <Step1
            onChange={value => this.onChange(value)}
            basic={this.props.basic}
            form={this.state.form}
            id={this.state.id}
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

DashboardsForm.propTypes = {
  user: PropTypes.object,
  id: PropTypes.string,
  basic: PropTypes.bool,
  onSubmit: PropTypes.func
};

export default DashboardsForm;
