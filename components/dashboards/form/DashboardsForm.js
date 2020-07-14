import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import { Router } from 'routes';


// components
import Navigation from 'components/form/Navigation';
import Spinner from 'components/ui/Spinner';
import Step1 from 'components/dashboards/form/steps/step-1';

// services
import { fetchDashboard, createDashboard, updateDashboard } from 'services/dashboard';

// utils
import { logEvent } from 'utils/analytics';

// constants
import { STATE_DEFAULT, FORM_ELEMENTS } from 'components/dashboards/form/constants';

class DashboardsForm extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    id: PropTypes.string,
    basic: PropTypes.bool,
    onSubmit: PropTypes.func
  }

  static defaultProps = {
    id: null,
    basic: false,
    onSubmit: null
  }

  state = {
    ...STATE_DEFAULT,
    loading: !!this.props.id,
    form: {
      ...STATE_DEFAULT.form,
      user_id: this.props.user.id
    }
  }

  componentDidMount() {
    const { id } = this.props;
    // Get the dashboards and fill the
    // state form with its params if the id exists
    if (id) {
      fetchDashboard(id)
        .then((data) => {
          this.setState({
            form: this.setFormFromParams(data),
            loading: false
          });
        })
        .catch((err) => { toastr.error(err.message); });
    }
  }

  onSubmit = (event) => {
    const { user: { token } } = this.props;
    const {
      step,
      form,
      submitting,
      stepLength
    } = this.state;
    event.preventDefault();

    FORM_ELEMENTS.validate(step);

    // Set a timeout due to the setState function of react
    setTimeout(() => {
      // Validate all the inputs on the current step
      const valid = FORM_ELEMENTS.isValid(step);
      const onFetchSuccess = (data) => {
        const { id: dashboardId, name } = data;
        toastr.success('Success', `The dashboard "${dashboardId}" - "${name}" has been uploaded correctly`);

        if (this.props.onSubmit) this.props.onSubmit();
      };
      const onFetchError = (err) => {
        this.setState({ submitting: false });
        toastr.error('Error', `Oops! There was an error, try again. ${err.message}`);
      };

      if (valid) {
        // if we are in the last step we will submit the form
        if (step === stepLength && !submitting) {
          const { id } = this.props;

          this.setState({ submitting: true });

          if (!id) {
            createDashboard(form, token)
              .then(onFetchSuccess)
              .catch(onFetchError);
            logEvent('My RW', 'User creates a new dashboard', form.name);
          } else {
            updateDashboard(id, form, token)
              .then(onFetchSuccess)
              .catch(onFetchError);
            logEvent('My RW', 'User updates an existing dashboard', form.name);
          }
        } else {
          this.setState({ step: step + 1 });
        }
      } else {
        toastr.error('Error', 'Fill all the required fields or correct the invalid values');
      }
    }, 0);
  }

  onChange =(obj) => {
    const form = Object.assign({}, this.state.form, obj);
    this.setState({ form });
  }

  onStepChange = (step) => { this.setState({ step }); }

  onCancel = () => {
    const { basic } = this.props;
    if (basic) {
      Router.pushRoute('myrw', { tab: 'dashboards' });
    } else {
      Router.pushRoute('admin_dashboards');
    }
  }

  // HELPERS
  setFormFromParams(params) {
    const newForm = {};

    Object.keys(params).forEach((f) => {
      switch (f) {
        // TODO: if the API doesn't send it we won't need to handle it
        case 'photo': {
          if (params[f] && params[f].original !== '/photos/original/missing.png') {
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
    const { id, basic } = this.props;
    const {
      loading,
      form,
      step,
      stepLength,
      submitting
    } = this.state;

    return (
      <form
        className="c-form"
        onSubmit={this.onSubmit}
        noValidate
      >
        <Spinner
          isLoading={loading}
          className="-light"
        />

        {(this.state.step === 1 && !loading) &&
          <Step1
            onChange={value => this.onChange(value)}
            basic={basic}
            form={form}
            id={id}
            {...this.props}
          />
        }

        {!loading &&
          <Navigation
            step={step}
            stepLength={stepLength}
            submitting={submitting}
            onStepChange={this.onStepChange}
            onBack={this.onCancel}
          />
        }
      </form>
    );
  }
}

export default DashboardsForm;
