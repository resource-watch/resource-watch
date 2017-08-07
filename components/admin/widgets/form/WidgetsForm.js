import React from 'react';
import PropTypes from 'prop-types';

// Services
import WidgetsService from 'services/WidgetsService';
import DatasetsService from 'services/DatasetsService';

import { toastr } from 'react-redux-toastr';

// Constants
import { STATE_DEFAULT, FORM_ELEMENTS } from 'components/admin/widgets/form/constants';

// Components
import Navigation from 'components/form/Navigation';
import Step1 from 'components/admin/widgets/form/steps/Step1';
import Spinner from 'components/ui/Spinner';

class WidgetsForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({}, STATE_DEFAULT, {
      id: props.id,
      loading: !!props.id,
      form: STATE_DEFAULT.form
    });

    // BINDINGS
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onStepChange = this.onStepChange.bind(this);

    this.service = new WidgetsService({
      authorization: props.authorization
    });

    this.datasetsService = new DatasetsService({
      authorization: props.authorization
    });
  }

  componentDidMount() {
    const { id } = this.state;

    const promises = [
      this.datasetsService.fetchAllData({})
    ];

    // Add the dashboard promise if the id exists
    if (id) {
      promises.push(this.service.fetchData({ id }));
    }

    Promise.all(promises)
      .then((response) => {
        const datasets = response[0];
        const current = response[1];

        this.setState({
          // CURRENT DASHBOARD
          form: (id) ? this.setFormFromParams(current) : this.state.form,
          loading: false,
          // OPTIONS
          datasets: datasets.map(p => ({ label: p.name, value: p.id }))
        });
      })
      .catch((err) => {
        console.error(err);
      });
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
            body: this.state.form
          })
            .then((data) => {
              toastr.success('Success', `The widget "${data.id}" - "${data.title}" has been uploaded correctly`);

              if (this.props.onSubmit) this.props.onSubmit();
            })
            .catch((err) => {
              this.setState({ submitting: false });
              toastr.error('Error', `Oops! There was an error, try again`);
              console.error(err);
            });
        } else {
          this.setState({
            step: this.state.step + 1
          }, () => console.info(this.state));
        }
      } else {
        toastr.error('Error', 'Fill all the required fields');
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
    const newForm = {};

    Object.keys(params).forEach((f) => {
      switch (f) {
        default: {
          if ((typeof params[f] !== 'undefined' || params[f] !== null) ||
              (typeof this.state.form[f] !== 'undefined' || this.state.form[f] !== null)) {
            newForm[f] = params[f] || this.state.form[f];
          }
        }
      }
    });

    console.log(newForm);

    return newForm;
  }

  render() {
    return (
      <form className="c-form" onSubmit={this.onSubmit} noValidate>
        <Spinner isLoading={this.state.loading} className="-light" />

        {(this.state.step === 1 && !this.state.loading) &&
          <Step1
            id={this.state.id}
            form={this.state.form}
            partners={this.state.partners}
            datasets={this.state.datasets}
            onChange={value => this.onChange(value)}
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

WidgetsForm.propTypes = {
  authorization: PropTypes.string,
  id: PropTypes.string,
  onSubmit: PropTypes.func
};

export default WidgetsForm;
